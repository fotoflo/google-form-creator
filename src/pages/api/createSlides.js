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

      // STEP 2: Get the default slide ID to remove it later
      const presentation = await slides.presentations.get({
        presentationId: presentationId,
      });

      const defaultSlideId = presentation.data.slides[0].objectId;

      // STEP 3: Add slides based on markdown content
      console.log("Adding slides to presentation...");

      // Prepare batch update requests
      let requests = [];

      // Add each slide from the parsed markdown
      slideContents.forEach((slide, index) => {
        requests.push({
          createSlide: {
            objectId: `slide_${index}`,
            slideLayoutReference: {
              predefinedLayout: "TITLE_AND_BODY",
            },
            placeholderIdMappings: [
              {
                layoutPlaceholder: {
                  type: "TITLE",
                  index: 0,
                },
                objectId: `title_${index}`,
              },
              {
                layoutPlaceholder: {
                  type: "BODY",
                  index: 0,
                },
                objectId: `body_${index}`,
              },
            ],
          },
        });

        // Add title text
        requests.push({
          insertText: {
            objectId: `title_${index}`,
            text: slide.title,
          },
        });

        // Add body text
        requests.push({
          insertText: {
            objectId: `body_${index}`,
            text: slide.content,
          },
        });

        // Add speaker notes if present
        if (slide.speakerNotes) {
          requests.push({
            createSheetsChart: {
              objectId: `notes_${index}`,
              spreadsheetId: "notes",
              chartId: 0,
              linkingMode: "NOT_LINKED_IMAGE",
              elementProperties: {
                pageObjectId: `slide_${index}`,
                size: {
                  width: {
                    magnitude: 0,
                    unit: "PT",
                  },
                  height: {
                    magnitude: 0,
                    unit: "PT",
                  },
                },
                transform: {
                  scaleX: 1,
                  scaleY: 1,
                  translateX: 0,
                  translateY: 0,
                  unit: "PT",
                },
              },
            },
          });

          // Add speaker notes
          requests.push({
            createParagraphBullets: {
              objectId: `slide_${index}`,
              textRange: {
                type: "FIXED_RANGE",
                startIndex: 0,
                endIndex: slide.speakerNotes.length,
              },
              bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
            },
          });
        }
      });

      // Remove the default slide
      requests.push({
        deleteObject: {
          objectId: defaultSlideId,
        },
      });

      // Execute the batch update
      const batchUpdateResponse = await slides.presentations.batchUpdate({
        presentationId: presentationId,
        requestBody: {
          requests: requests,
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
  // Split the markdown by slide separator
  const slideTexts = markdownContent.split(/\n\s*---\s*\n/);

  // Process each slide
  return slideTexts.map((slideText) => {
    const lines = slideText.trim().split("\n");
    let title = "Untitled Slide";
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

    return {
      title,
      content,
      speakerNotes,
    };
  });
}

// Expose the results storage for the GET endpoint
export { slidesResults };
