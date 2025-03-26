import { getToken } from "next-auth/jwt";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

// In-memory storage (replace with a database in production)
const slidesResults = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user token to access the OAuth token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.accessToken) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Please sign in again." });
    }

    const { title, markdownContent } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Presentation title is required." });
    }

    if (!markdownContent) {
      return res.status(400).json({
        error:
          "Presentation content is missing. Please provide markdown content.",
      });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: token.accessToken,
    });

    // Initialize the Slides API
    const slides = google.slides({
      version: "v1",
      auth: oauth2Client,
    });

    // Parse markdown content into slides
    const slideContents = parseMarkdownToSlides(markdownContent);

    console.log(`Parsed ${slideContents.length} slides from markdown`);
    slideContents.forEach((slide, index) => {
      console.log(`Slide ${index + 1} content:`, {
        title: slide.title,
        contentLength: slide.content.length,
        hasNotes: slide.speakerNotes.length > 0,
      });
    });

    try {
      // STEP 1: Create an empty presentation with just the title
      console.log("Creating presentation with title:", title);
      const createResponse = await slides.presentations.create({
        requestBody: {
          title: title,
        },
      });

      const presentationId = createResponse.data.presentationId;
      console.log("Presentation created with ID:", presentationId);

      // STEP 2: Get the presentation details
      const presentation = await slides.presentations.get({
        presentationId: presentationId,
      });

      // Get the ID of the default slide to remove it later
      const defaultSlideId = presentation.data.slides[0].objectId;

      // STEP 3: Add slides based on markdown content
      console.log("Adding slides to presentation...");

      // Create a new slide for each content item
      let requests = [];
      slideContents.forEach((slide, index) => {
        // Create a new slide
        requests.push({
          createSlide: {
            objectId: `slide_${index}`,
            insertionIndex: index,
            slideLayoutReference: {
              predefinedLayout: "TITLE_AND_BODY",
            },
          },
        });
      });

      // Execute the batch update to create all slides
      console.log(`Creating ${requests.length} slides`);
      await slides.presentations.batchUpdate({
        presentationId: presentationId,
        requestBody: {
          requests: requests,
        },
      });

      // Get the updated presentation to find the elements
      const updatedPresentation = await slides.presentations.get({
        presentationId: presentationId,
      });

      console.log(
        `Presentation has ${updatedPresentation.data.slides.length} slides`
      );

      // Now prepare requests to update content
      let contentRequests = [];

      // For each slide, find its elements and update them
      // Skip the default slide (usually the first one)
      const createdSlides = updatedPresentation.data.slides.filter(
        (slide) => slide.objectId !== defaultSlideId
      );

      console.log(`Found ${createdSlides.length} created slides to update`);

      // First, update all slide content
      createdSlides.forEach((slideObj, index) => {
        console.log(
          `Updating slide ${index + 1} with objectId ${slideObj.objectId}`
        );

        // Get the corresponding content
        const slideContent = slideContents[index];
        if (!slideContent) {
          console.log(`No content found for slide ${index + 1}`);
          return;
        }

        // Find title and body placeholders
        const titlePlaceholder = slideObj.pageElements.find(
          (el) =>
            el.shape &&
            el.shape.placeholder &&
            el.shape.placeholder.type === "TITLE"
        );

        const bodyPlaceholder = slideObj.pageElements.find(
          (el) =>
            el.shape &&
            el.shape.placeholder &&
            el.shape.placeholder.type === "BODY"
        );

        console.log(
          `Title placeholder: ${titlePlaceholder ? "found" : "not found"}`
        );
        console.log(
          `Body placeholder: ${bodyPlaceholder ? "found" : "not found"}`
        );

        // Update title
        if (titlePlaceholder) {
          contentRequests.push({
            insertText: {
              objectId: titlePlaceholder.objectId,
              text: slideContent.title,
              insertionIndex: 0,
            },
          });
        }

        // Update body
        if (bodyPlaceholder) {
          // Clean up the content to remove any speaker notes markers
          let cleanContent = slideContent.content;

          // Remove any lines that might contain speaker notes markers
          cleanContent = cleanContent.replace(/SPEAKER\s*NOTES/gi, "").trim();
          cleanContent = cleanContent.replace(/>>>/g, "").trim();
          cleanContent = cleanContent.replace(/<<</g, "").trim();

          // Clean up any empty lines that might have been left
          cleanContent = cleanContent.replace(/\n\s*\n/g, "\n").trim();

          contentRequests.push({
            insertText: {
              objectId: bodyPlaceholder.objectId,
              text: cleanContent,
              insertionIndex: 0,
            },
          });

          // Format bullet points if needed
          if (cleanContent.includes("- ") || cleanContent.includes("• ")) {
            contentRequests.push({
              createParagraphBullets: {
                objectId: bodyPlaceholder.objectId,
                textRange: {
                  type: "ALL",
                },
                bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
              },
            });
          }
        }

        // Add image prompt box if present
        if (slideContent.imagePrompt && slideContent.imagePrompt.trim()) {
          console.log(`Adding image prompt to slide ${index + 1}`);

          const promptObjectId = `image_prompt_${slideObj.objectId}`;

          // Create a colored box for the image prompt at the bottom right
          contentRequests.push({
            createShape: {
              objectId: promptObjectId,
              shapeType: "RECTANGLE",
              elementProperties: {
                pageObjectId: slideObj.objectId,
                size: {
                  width: { magnitude: 200, unit: "PT" },
                  height: { magnitude: 80, unit: "PT" },
                },
                transform: {
                  scaleX: 1,
                  scaleY: 1,
                  translateX: 500, // Position at bottom right
                  translateY: 320,
                  unit: "PT",
                },
              },
            },
          });

          // Add a light purple fill to the box
          contentRequests.push({
            updateShapeProperties: {
              objectId: promptObjectId,
              shapeProperties: {
                shapeBackgroundFill: {
                  solidFill: {
                    color: {
                      rgbColor: {
                        red: 0.9,
                        green: 0.8,
                        blue: 1.0,
                      },
                    },
                  },
                },
              },
              fields: "shapeBackgroundFill",
            },
          });

          // Add a border to the box
          contentRequests.push({
            updateShapeProperties: {
              objectId: promptObjectId,
              shapeProperties: {
                outline: {
                  outlineFill: {
                    solidFill: {
                      color: {
                        rgbColor: {
                          red: 0.6,
                          green: 0.4,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                  weight: {
                    magnitude: 1,
                    unit: "PT",
                  },
                },
              },
              fields: "outline",
            },
          });

          // Add the image prompt text with an "IMAGE:" prefix
          contentRequests.push({
            insertText: {
              objectId: promptObjectId,
              text: `IMAGE: ${slideContent.imagePrompt}`,
            },
          });

          // Style the image prompt text
          contentRequests.push({
            updateTextStyle: {
              objectId: promptObjectId,
              style: {
                fontSize: { magnitude: 10, unit: "PT" },
                foregroundColor: {
                  opaqueColor: {
                    rgbColor: { red: 0.3, green: 0.1, blue: 0.5 },
                  },
                },
                bold: true,
              },
              textRange: { type: "ALL" },
              fields: "fontSize,foregroundColor,bold",
            },
          });

          console.log(`Added image prompt box with ID ${promptObjectId}`);
        }
      });

      // Delete the default slide
      contentRequests.push({
        deleteObject: {
          objectId: defaultSlideId,
        },
      });

      console.log(
        `Executing ${contentRequests.length} content update requests`
      );

      // Execute the content update batch
      await slides.presentations.batchUpdate({
        presentationId: presentationId,
        requestBody: {
          requests: contentRequests,
        },
      });

      console.log("Slide content updated successfully");

      // STEP 4: Now handle speaker notes in a separate step
      // Get the updated presentation again to access the notes pages
      const finalPresentation = await slides.presentations.get({
        presentationId: presentationId,
        fields: "slides.objectId,slides.slideProperties.notesPage",
      });

      // Prepare requests for speaker notes
      let speakerNotesRequests = [];

      // Process each slide to add speaker notes - use Promise.all to handle async operations
      await Promise.all(
        finalPresentation.data.slides.map(async (slide, index) => {
          // Skip slides without content or notes
          if (index >= slideContents.length) return;

          const slideContent = slideContents[index];

          // Skip if no speaker notes
          if (
            !slideContent ||
            !slideContent.speakerNotes ||
            !slideContent.speakerNotes.trim()
          ) {
            return;
          }

          console.log(`Processing speaker notes for slide ${index + 1}`);

          // Check if the slide has a notes page
          if (slide.slideProperties && slide.slideProperties.notesPage) {
            const notesPage = slide.slideProperties.notesPage;

            try {
              // Get the detailed notes page to find the speaker notes shape
              const notesPageResponse = await slides.presentations.pages.get({
                presentationId: presentationId,
                pageObjectId: notesPage.objectId,
              });

              if (
                notesPageResponse.data &&
                notesPageResponse.data.pageElements
              ) {
                // Find the speaker notes shape (usually a SHAPE_TYPE_TEXT_BOX)
                const speakerNotesShape =
                  notesPageResponse.data.pageElements.find(
                    (el) =>
                      el.shape &&
                      (el.shape.shapeType === "TEXT_BOX" ||
                        el.shape.placeholder?.type === "BODY")
                  );

                if (speakerNotesShape) {
                  console.log(
                    `Found speaker notes shape with ID ${speakerNotesShape.objectId}`
                  );

                  // Add text to the speaker notes shape
                  speakerNotesRequests.push({
                    insertText: {
                      objectId: speakerNotesShape.objectId,
                      text: slideContent.speakerNotes,
                      insertionIndex: 0,
                    },
                  });
                } else {
                  console.log(
                    `No speaker notes shape found for slide ${index + 1}`
                  );
                  fallbackToTextBox(
                    slide.objectId,
                    slideContent.speakerNotes,
                    speakerNotesRequests
                  );
                }
              } else {
                console.log(
                  `No page elements found for notes page of slide ${index + 1}`
                );
                fallbackToTextBox(
                  slide.objectId,
                  slideContent.speakerNotes,
                  speakerNotesRequests
                );
              }
            } catch (notesError) {
              console.error(`Error getting notes page: ${notesError.message}`);
              fallbackToTextBox(
                slide.objectId,
                slideContent.speakerNotes,
                speakerNotesRequests
              );
            }
          } else {
            console.log(`No notes page found for slide ${index + 1}`);
            fallbackToTextBox(
              slide.objectId,
              slideContent.speakerNotes,
              speakerNotesRequests
            );
          }
        })
      );

      // Execute the speaker notes update batch if we have any requests
      if (speakerNotesRequests.length > 0) {
        console.log(
          `Executing ${speakerNotesRequests.length} speaker notes update requests`
        );

        await slides.presentations.batchUpdate({
          presentationId: presentationId,
          requestBody: {
            requests: speakerNotesRequests,
          },
        });

        console.log("Speaker notes added successfully");
      }

      // Generate a unique ID for this result
      const resultId = uuidv4();

      // Store the result
      slidesResults[resultId] = {
        id: resultId,
        title: title,
        presentationId: presentationId,
        presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
        timestamp: new Date().toISOString(),
        type: "google-slides",
      };

      // Return the ID and URL to the client
      return res.status(200).json({
        id: resultId,
        presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
        message: "Presentation created successfully!",
      });
    } catch (apiError) {
      console.error("Google Slides API error:", apiError);
      console.error("Error details:", JSON.stringify(apiError, null, 2));

      // Handle specific Google API errors
      if (apiError.code === 401 || apiError.code === 403) {
        return res.status(403).json({
          error:
            "Permission denied. Make sure your Google account has access to Google Slides.",
          details: apiError.message,
        });
      }

      if (apiError.code === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded. Please try again later.",
          details: apiError.message,
        });
      }

      return res.status(500).json({
        error: "Failed to create presentation with Google Slides API.",
        details: apiError.message || "Unknown Google API error",
      });
    }
  } catch (error) {
    console.error("Error creating presentation:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while creating your presentation.",
      details: error.message || "Unknown error",
    });
  }
}

// Helper function to parse markdown content into slides
function parseMarkdownToSlides(markdownContent) {
  // Use the unique separator pattern for slides
  const slideTexts = markdownContent.split(/\n\s*===SLIDE===\s*\n/);
  console.log(`Found ${slideTexts.length} slides in markdown content`);

  // Process each slide
  return slideTexts.map((slideText, index) => {
    console.log(`Processing slide ${index + 1}`);
    let title = `Slide ${index + 1}`;
    let content = "";
    let speakerNotes = "";
    let imagePrompt = "";

    // Extract title - look for lines starting with "Slide X:" or "# "
    const titleMatch = slideText.match(/^(?:Slide \d+:|#)\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].trim();
      // Remove the title line from content
      content = slideText.replace(/^(?:Slide \d+:|#)\s+(.+)$/m, "").trim();
    } else {
      content = slideText.trim();
    }

    // First, extract image prompts to prevent them from being captured as speaker notes
    // Look for content between <IMAGE PROMPT> and </IMAGE PROMPT>
    const imagePromptRegex = /<IMAGE\s*PROMPT>([\s\S]*?)<\/IMAGE\s*PROMPT>/i;
    const imagePromptMatch = content.match(imagePromptRegex);

    if (imagePromptMatch) {
      imagePrompt = imagePromptMatch[1].trim();
      // Remove the image prompt section from content
      content = content.replace(imagePromptRegex, "").trim();
      console.log(
        `Found image prompt with <IMAGE PROMPT> tags: "${imagePrompt.substring(
          0,
          50
        )}${imagePrompt.length > 50 ? "..." : ""}"`
      );
    }

    // Also support the old formats for backward compatibility
    // Look for content between >>> IMAGE PROMPT >>> and <<< IMAGE PROMPT <<<
    if (!imagePrompt) {
      const oldImagePromptRegex =
        />>>\s*IMAGE\s*PROMPT\s*>>>([\s\S]*?)<<<\s*IMAGE\s*PROMPT\s*<<</i;
      const oldImagePromptMatch = content.match(oldImagePromptRegex);

      if (oldImagePromptMatch) {
        imagePrompt = oldImagePromptMatch[1].trim();
        // Remove the image prompt section from content
        content = content.replace(oldImagePromptRegex, "").trim();
        console.log(
          `Found image prompt with old delimiter: "${imagePrompt.substring(
            0,
            50
          )}${imagePrompt.length > 50 ? "..." : ""}"`
        );
      }
    }

    // Alternative format: lines starting with !>
    const altImagePromptRegex = /!>\s+(.+)$/gm;
    const altImagePromptMatches = [...content.matchAll(altImagePromptRegex)];

    if (altImagePromptMatches.length > 0) {
      // Only set imagePrompt if it wasn't already set by the delimiter method
      if (!imagePrompt) {
        imagePrompt = altImagePromptMatches.map((match) => match[1]).join("\n");
        console.log(
          `Found image prompt with !> format: "${imagePrompt.substring(0, 50)}${
            imagePrompt.length > 50 ? "..." : ""
          }"`
        );
      }
      // Always remove the !> lines from content
      content = content.replace(/!>\s+(.+)$/gm, "").trim();
    }

    // Now extract speaker notes after image prompts have been removed
    // Look for content between >>> SPEAKER NOTES >>> and <<< SPEAKER NOTES <<<
    const strongNotesRegex =
      />>>\s*SPEAKER\s*NOTES\s*>>>([\s\S]*?)<<<\s*SPEAKER\s*NOTES\s*<<</i;
    const strongNotesMatch = content.match(strongNotesRegex);

    if (strongNotesMatch) {
      speakerNotes = strongNotesMatch[1].trim();
      // Remove the speaker notes section from content
      content = content.replace(strongNotesRegex, "").trim();
      console.log(
        `Found speaker notes with delimiter: "${speakerNotes.substring(0, 50)}${
          speakerNotes.length > 50 ? "..." : ""
        }"`
      );
    }

    // Fall back to the traditional format (lines starting with >)
    // But make sure they don't start with !> which is for image prompts
    const traditionalNotesRegex = /^>\s+(?!!>)(.+)$/gm;
    const traditionalNotesMatches = [
      ...content.matchAll(traditionalNotesRegex),
    ];

    if (traditionalNotesMatches.length > 0) {
      // Only set speakerNotes if it wasn't already set by the delimiter method
      if (!speakerNotes) {
        speakerNotes = traditionalNotesMatches
          .map((match) => match[1])
          .join("\n");
        console.log(
          `Found speaker notes with > format: "${speakerNotes.substring(
            0,
            50
          )}${speakerNotes.length > 50 ? "..." : ""}"`
        );
      }
      // Always remove the > lines from content
      content = content.replace(/^>\s+(?!!>)(.+)$/gm, "").trim();
    }

    // Additional cleanup for any remaining markers
    content = content.replace(/SPEAKER\s*NOTES\s*>>.*$/gm, "").trim();
    content = content.replace(/<<<\s*SPEAKER\s*NOTES\s*<<<.*$/gm, "").trim();
    content = content.replace(/IMAGE\s*PROMPT\s*>>.*$/gm, "").trim();
    content = content.replace(/<<<\s*IMAGE\s*PROMPT\s*<<<.*$/gm, "").trim();
    content = content.replace(/<IMAGE\s*PROMPT>.*$/gm, "").trim();
    content = content.replace(/<\/IMAGE\s*PROMPT>.*$/gm, "").trim();

    // Clean up any lines that just contain marker text
    content = content.replace(/^.*SPEAKER\s*NOTES.*$/gm, "").trim();
    content = content.replace(/^.*IMAGE\s*PROMPT.*$/gm, "").trim();
    content = content.replace(/^.*<\/?IMAGE\s*PROMPT>.*$/gm, "").trim();

    // Remove any empty lines at the beginning or end
    content = content.replace(/^\s+|\s+$/g, "");

    console.log(
      `Slide ${index + 1} processed: title="${title}", content length=${
        content.length
      }, has notes=${speakerNotes.length > 0}, has image prompt=${
        imagePrompt.length > 0
      }`
    );

    return {
      title,
      content,
      speakerNotes,
      imagePrompt,
    };
  });
}

// Helper function to create a text box for speaker notes as a fallback
function fallbackToTextBox(slideObjectId, speakerNotes, requestsArray) {
  const notesObjectId = `notes_text_${slideObjectId}`;

  // Create a text box for the notes
  requestsArray.push({
    createShape: {
      objectId: notesObjectId,
      shapeType: "TEXT_BOX",
      elementProperties: {
        pageObjectId: slideObjectId,
        size: {
          width: { magnitude: 400, unit: "PT" },
          height: { magnitude: 50, unit: "PT" },
        },
        transform: {
          scaleX: 1,
          scaleY: 1,
          translateX: 50,
          translateY: 400,
          unit: "PT",
        },
      },
    },
  });

  // Add the notes text with a "NOTES:" prefix
  requestsArray.push({
    insertText: {
      objectId: notesObjectId,
      text: `NOTES: ${speakerNotes}`,
    },
  });

  // Style the notes text to be smaller and italic
  requestsArray.push({
    updateTextStyle: {
      objectId: notesObjectId,
      style: {
        fontSize: { magnitude: 10, unit: "PT" },
        italic: true,
        foregroundColor: {
          opaqueColor: {
            rgbColor: { red: 0.5, green: 0.5, blue: 0.5 },
          },
        },
      },
      textRange: { type: "ALL" },
      fields: "fontSize,italic,foregroundColor",
    },
  });

  console.log(`Added speaker notes as a text box with ID ${notesObjectId}`);
}

// Expose the results storage for the GET endpoint
export { slidesResults };
