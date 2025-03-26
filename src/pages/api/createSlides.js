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
      const createSlidesResponse = await slides.presentations.batchUpdate({
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
          contentRequests.push({
            insertText: {
              objectId: bodyPlaceholder.objectId,
              text: slideContent.content,
              insertionIndex: 0,
            },
          });

          // Format bullet points if needed
          if (slideContent.content.includes("- ")) {
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

        // Add speaker notes
        if (slideContent.speakerNotes && slideContent.speakerNotes.trim()) {
          console.log(`Adding speaker notes to slide ${index + 1}`);
          contentRequests.push({
            insertText: {
              objectId: slideObj.objectId,
              text: slideContent.speakerNotes,
              insertionIndex: 0,
              speakerNotesObjectId: slideObj.objectId,
            },
          });
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
      const contentUpdateResponse = await slides.presentations.batchUpdate({
        presentationId: presentationId,
        requestBody: {
          requests: contentRequests,
        },
      });

      console.log("Slides added successfully");

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
  // Use a more unique separator pattern: "===SLIDE==="
  const slideTexts = markdownContent.split(/\n\s*===SLIDE===\s*\n/);
  console.log(`Found ${slideTexts.length} slides in markdown content`);

  // Process each slide
  return slideTexts.map((slideText, index) => {
    console.log(`Processing slide ${index + 1}`);
    let title = `Slide ${index + 1}`;
    let content = "";
    let speakerNotes = "";

    // Extract title (first # heading)
    const titleMatch = slideText.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
      // Remove the title line from content
      content = slideText.replace(/^#\s+(.+)$/m, "").trim();
    } else {
      content = slideText.trim();
    }

    // Extract speaker notes (lines starting with >)
    const notesRegex = />\s+(.+)$/gm;
    const notesMatches = [...content.matchAll(notesRegex)];

    if (notesMatches.length > 0) {
      speakerNotes = notesMatches.map((match) => match[1]).join("\n");
      // Remove speaker notes from content
      content = content.replace(/>\s+(.+)$/gm, "").trim();
    }

    console.log(
      `Slide ${index + 1} processed: title="${title}", content length=${
        content.length
      }, has notes=${speakerNotes.length > 0}`
    );

    return {
      title,
      content,
      speakerNotes,
    };
  });
}

// Expose the results storage for the GET endpoint
export { slidesResults };
