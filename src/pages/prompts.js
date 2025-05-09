import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { FiCopy, FiCheck } from "react-icons/fi";

const prompts = [
  {
    title: "Google Slides Presentation",
    description:
      "Create a professional presentation with speaker notes and image prompts",
    prompt: `You are about to create a professional Google Slides presentation from markdown content.  
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

Use this format for every slide. Do not include any extra commentary or explanation outside the code block.`,
  },
  {
    title: "Google Form",
    description: "Generate a form with customized questions and options",
    prompt: `Please help me create a Google Form with the following requirements:

[Describe your form requirements here]

The form should include:
1. A clear title and description
2. Appropriate question types (multiple choice, short answer, paragraph, etc.)
3. Required fields marked appropriately
4. Logical question order and grouping
5. Clear instructions where needed

Format your response in a way that's optimized for conversion into a Google Form.`,
  },
  {
    title: "Google Doc",
    description: "Create a professional document with proper formatting",
    prompt: `Please help me create a Google Doc with the following requirements:

[Describe your document requirements here]

The document should include:
1. A clear title and structure
2. Proper headings and subheadings
3. Well-formatted paragraphs
4. Any necessary lists or tables
5. Appropriate emphasis (bold, italic) where needed

Format your response in a way that's optimized for conversion into a Google Doc.`,
  },
];

export default function Prompts() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (prompt, index) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Steal Our Prompts | Prompt2Doc</title>
        <meta
          name="description"
          content="Copy and use our AI prompts to create professional Google documents"
        />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Steal Our Prompts
          </h1>
          <p className="text-xl text-gray-600">
            Use these prompts with any AI assistant to create professional
            Google documents
          </p>
        </div>

        <div className="space-y-8">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {prompt.title}
                    </h2>
                    <p className="text-gray-600">{prompt.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(prompt.prompt, index)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-5 h-5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                    <code>{prompt.prompt}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Want to try these prompts with our AI-powered document creator?
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Prompt2Doc</p>
      </footer>
    </div>
  );
}
