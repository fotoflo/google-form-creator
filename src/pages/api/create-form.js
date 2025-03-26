import { getToken } from "next-auth/jwt";
import { google } from "googleapis";

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

    const { formName, jsonData } = JSON.parse(req.body);

    if (!formName) {
      return res.status(400).json({ error: "Form name is required." });
    }

    if (!jsonData) {
      return res.status(400).json({
        error: "Form data is missing. Please provide JSON data for your form.",
      });
    }

    // Parse the JSON data
    let parsedJsonData;
    try {
      parsedJsonData =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      if (!Array.isArray(parsedJsonData) || parsedJsonData.length === 0) {
        return res.status(400).json({
          error: "Invalid JSON format. Please provide an array of questions.",
        });
      }

      // Validate each question has required fields
      for (let i = 0; i < parsedJsonData.length; i++) {
        const question = parsedJsonData[i];
        if (!question.title) {
          return res.status(400).json({
            error: `Question #${i + 1} is missing a title.`,
          });
        }
        if (!question.type) {
          return res.status(400).json({
            error: `Question #${i + 1} ("${
              question.title
            }") is missing a type.`,
          });
        }

        // Check if options are provided for question types that need them
        if (
          ["multipleChoice", "checkboxes", "dropdown"].includes(question.type)
        ) {
          if (
            !question.options ||
            !Array.isArray(question.options) ||
            question.options.length === 0
          ) {
            return res.status(400).json({
              error: `Question #${i + 1} ("${
                question.title
              }") requires options for type "${question.type}".`,
            });
          }
        }
      }
    } catch (error) {
      console.error("JSON parsing error:", error.message);
      return res.status(400).json({
        error: "Invalid JSON format. Please check your syntax.",
        details: error.message,
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

    // Initialize the Forms API
    const forms = google.forms({
      version: "v1",
      auth: oauth2Client,
    });

    try {
      // STEP 1: Create an empty form with just the title
      console.log("Creating form with title:", formName);
      const createResponse = await forms.forms.create({
        requestBody: {
          info: {
            title: formName,
            documentTitle: formName,
          },
        },
      });

      const formId = createResponse.data.formId;
      console.log("Form created with ID:", formId);

      // STEP 2: Add questions to the form using batchUpdate
      const formItems = convertJsonToGoogleForm(parsedJsonData);
      console.log("Prepared form items:", JSON.stringify(formItems, null, 2));

      console.log("Adding questions to form...");
      await forms.forms.batchUpdate({
        formId: formId,
        requestBody: {
          requests: formItems.map((item, index) => ({
            createItem: {
              item: item,
              location: { index: index },
            },
          })),
        },
      });
      console.log("Questions added successfully");

      // Return the form URL
      const formUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
      console.log("Form URL:", formUrl);

      return res.status(200).json({
        formUrl,
        message: "Form created successfully!",
      });
    } catch (apiError) {
      console.error("Google Forms API error:", apiError);
      console.error("Error details:", JSON.stringify(apiError, null, 2));

      // Handle specific Google API errors
      if (apiError.code === 401 || apiError.code === 403) {
        return res.status(403).json({
          error:
            "Permission denied. Make sure your Google account has access to Google Forms.",
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
        error: "Failed to create form with Google Forms API.",
        details: apiError.message || "Unknown Google API error",
      });
    }
  } catch (error) {
    console.error("Error creating form:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while creating your form.",
      details: error.message || "Unknown error",
    });
  }
}

// Helper function to convert JSON to Google Forms format
function convertJsonToGoogleForm(jsonData) {
  // Process each question from the JSON
  return jsonData.map((question, index) => {
    const formItem = {
      title: question.title || `Question ${index + 1}`,
    };

    if (question.description) {
      formItem.description = question.description;
    }

    // Set the question type
    switch (question.type) {
      case "text":
        formItem.questionItem = {
          question: {
            required: question.required || false,
            textQuestion: { paragraph: false },
          },
        };
        break;
      case "paragraph":
        formItem.questionItem = {
          question: {
            required: question.required || false,
            textQuestion: { paragraph: true },
          },
        };
        break;
      case "multipleChoice":
        formItem.questionItem = {
          question: {
            required: question.required || false,
            choiceQuestion: {
              type: "RADIO",
              options: (question.options || []).map((option) => ({
                value: option,
              })),
            },
          },
        };
        break;
      case "checkboxes":
        formItem.questionItem = {
          question: {
            required: question.required || false,
            choiceQuestion: {
              type: "CHECKBOX",
              options: (question.options || []).map((option) => ({
                value: option,
              })),
            },
          },
        };
        break;
      case "dropdown":
        formItem.questionItem = {
          question: {
            required: question.required || false,
            choiceQuestion: {
              type: "DROP_DOWN",
              options: (question.options || []).map((option) => ({
                value: option,
              })),
            },
          },
        };
        break;
      default:
        // Default to short text
        formItem.questionItem = {
          question: {
            required: question.required || false,
            textQuestion: { paragraph: false },
          },
        };
    }

    return formItem;
  });
}
