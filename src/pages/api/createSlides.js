import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";
import { slidesPrompts } from "../../utils/formPrompts";

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// In-memory storage (replace with a database in production)
const slidesResults = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = req.body;

    // Create a system prompt that handles markdown content and returns markdown
    const systemPrompt = `You are an expert presentation designer who creates professional Google Slides presentations.
    Convert the user's markdown content into a well-structured presentation in markdown format.
    
    Format your response as markdown with the following structure:
    
    # Slide 1: Title
    
    - Bullet point 1
    - Bullet point 2
    
    > Speaker notes: Additional context or notes for the presenter
    
    ---
    
    # Slide 2: Content Slide
    
    1. Numbered point 1
    2. Numbered point 2
    
    > Speaker notes: More context
    
    ---
    
    Each slide should be separated by "---" on its own line.
    Include appropriate slide titles, content, and speaker notes.
    Ensure the presentation flows logically and maintains a consistent style.`;

    // Create the user prompt with the markdown content
    const userPrompt = `Create a Google Slides presentation with the following details:
    
    Title: ${formData.title}
    
    Content (in markdown format with "---" separating slides):
    ${formData.markdownContent}
    
    Please convert this into a well-structured presentation in markdown format.
    Each slide should be separated by "---" on its own line.
    Include appropriate slide titles, content, and speaker notes.`;

    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    // Extract the response content
    const slidesContent = response.data.choices[0].message.content;

    // Generate a unique ID for this result
    const resultId = uuidv4();

    // Store the result
    slidesResults[resultId] = {
      id: resultId,
      title: formData.title,
      content: slidesContent,
      timestamp: new Date().toISOString(),
      type: "slides-markdown",
    };

    // Return the ID to the client
    return res.status(200).json({ id: resultId });
  } catch (error) {
    console.error("Error creating slides:", error);
    return res.status(500).json({ error: "Failed to create slides" });
  }
}

// Expose the results storage for the GET endpoint
export { slidesResults };
