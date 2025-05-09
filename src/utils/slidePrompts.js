/**
 * Example slides for documentation and prompts
 */
export const slideExamples = {
  introduction: {
    title: "Introduction",
    bullets: ["Welcome to our presentation", "Today we'll discuss key points"],
    speakerNotes: "Introduce team members here",
    imagePrompt: "A professional team meeting in a modern office setting",
  },
  mainTopic: {
    title: "Main Topic",
    numberedPoints: ["First important point", "Second important point"],
    speakerNotes:
      "Explain the details of each point\nAdd any additional context for the presenter",
    imagePrompt: "Detailed diagram showing the concept in action",
  },
  conclusion: {
    title: "Conclusion",
    bullets: ["Summary of key takeaways", "Next steps"],
    speakerNotes: "",
    imagePrompt: "",
  },
};

/**
 * Formats the example slides as markdown
 * @returns {string} Formatted markdown example
 */
export function getExampleMarkdown() {
  const intro = slideExamples.introduction;
  const main = slideExamples.mainTopic;
  const conclusion = slideExamples.conclusion;

  return `# ${intro.title}
- ${intro.bullets[0]}
- ${intro.bullets[1]}
> ${intro.speakerNotes}
!> ${intro.imagePrompt}

===SLIDE===

# ${main.title}
1. ${main.numberedPoints[0]}
2. ${main.numberedPoints[1]}

>>> SPEAKER NOTES >>>
${main.speakerNotes}
<<< SPEAKER NOTES <<<

<IMAGE PROMPT>
${main.imagePrompt}
</IMAGE PROMPT>

===SLIDE===

# ${conclusion.title}
- ${conclusion.bullets[0]}
- ${conclusion.bullets[1]}`;
}

/**
 * Generates a prompt for creating Google Slides with ChatGPT
 * @param {Object} formData - Contains title and markdownContent
 * @returns {string} The formatted prompt
 */
export function generateSlidesPrompt(formData) {
  return `You are about to create a professional Google Slides presentation from markdown content.  
If prior conversation context is available, use it to infer the likely topic, structure, and tone of the presentation.  
If no clear topic or structure can be inferred, begin a structured conversation to help the user define the key elements of the presentation before generating slides.

**Before generating slides, ask the user the following questions one at a time:**

1. Who is the target audience for this presentation?  
2. What tone or visual style should the slides use? (e.g., minimalist, corporate, playful)  
3. Do you want to define a specific image style? (e.g., flat illustrations, realistic photos, muted tones)?  
4. How many slides should the presentation have (approximate or exact)?  

**Do not begin generating slides until you've received all four answers.**

---

**When you're ready, output the full presentation in this exact format:**

Wrap the entire output in a markdown code block using \`\`\`md at the start and \`\`\` at the end.

Each slide should follow this structure:

\`\`\`md
# Slide Title  
- Bullet point 1  
- Bullet point 2  
>>> SPEAKER NOTES >>>
Speaker notes (optional)
<<< SPEAKER NOTES <<<

<IMAGE PROMPT>
Describe the image you'd like to generate
</IMAGE PROMPT>

===SLIDE===  
\`\`\`

Use this format for every slide. Do not include any extra commentary or explanation outside the code block.

---

**Image prompt requirements:**  
- Always use **16:9 aspect ratio**  
- Match the tone and visual style specified by the user  
- Include an image prompt only when it enhances the slide  
- Wrap image prompts in **<IMAGE PROMPT>** tags (as shown above)
- The image prompt should *ALWAYS* specify "No text. Leave ample negative space on the image for it to serve as a presentation background."

---

**Reference structure:**  
${"```md\n" + getExampleMarkdown() + "\n```"}

---

**My presentation title:**  
${formData.title}

**Content:**  
${formData.markdownContent}

---

**Instructions:**  
- Ensure the presentation flows logically  
- Use clear, relevant slide titles  
- Add speaker notes when needed  
- Respect the user's preferences for tone, audience, and visual style  
- Stick to the requested slide count  
- Format the final response exactly as described above, in a single \`md\` block


Once the full presentation has been generated and displayed in a single markdown block, ask the user:

"Now would you like me to generate the images one by one?"

Wait for their response before generating any image content.`;
}
