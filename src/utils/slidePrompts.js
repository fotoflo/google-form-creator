/**
 * Example slides for documentation and prompts
 */
export const slideExamples = {
  introduction: {
    title: "Introduction",
    bullets: ["Welcome to our presentation", "Today we'll discuss key points"],
    speakerNotes: "Introduce team members here",
  },
  mainTopic: {
    title: "Main Topic",
    numberedPoints: ["First important point", "Second important point"],
    speakerNotes:
      "Explain the details of each point\nAdd any additional context for the presenter",
  },
  conclusion: {
    title: "Conclusion",
    bullets: ["Summary of key takeaways", "Next steps"],
    speakerNotes: "",
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

===SLIDE===

# ${main.title}
1. ${main.numberedPoints[0]}
2. ${main.numberedPoints[1]}

>>> SPEAKER NOTES >>>
${main.speakerNotes}
<<< SPEAKER NOTES <<<

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
  return `Create a professional Google Slides presentation based on the following markdown content.
Format your response as markdown with the following structure:

${getExampleMarkdown()}

My presentation title: ${formData.title}

Content:
${formData.markdownContent}

Each slide should be separated by "===SLIDE===" on its own line.
Include appropriate slide titles, content, and speaker notes.
Ensure the presentation flows logically and maintains a consistent style.`;
}
