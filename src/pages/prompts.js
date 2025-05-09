import Head from "next/head";
import TopNav from "../components/TopNav";
import { FiCopy } from "react-icons/fi";

export default function Prompts() {
  const examplePrompts = [
    {
      title: "Document Creation",
      description:
        "Create a professional document with proper formatting and structure",
      prompt: `Please help me structure the following content for a Google Doc:

[Paste your content or describe what you need]

Format your response in a way that&apos;s optimized for Prompt2Doc to convert into a professional document. Include all necessary sections, formatting, and organization.`,
    },
    {
      title: "Presentation Slides",
      description:
        "Generate a presentation with speaker notes and image suggestions",
      prompt: `Please help me create a presentation with the following content:

[Paste your content or describe what you need]

Format your response using markdown with "===SLIDE===" to separate slides. Include speaker notes using ">" and image suggestions using "!>".`,
    },
    {
      title: "Form Creation",
      description:
        "Design a form with appropriate question types and validation",
      prompt: `Please help me create a form with the following requirements:

[Describe your form needs]

Format your response with clear sections for questions, options, and any validation rules needed.`,
    },
  ];

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    // TODO: Add toast notification
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>AI Prompts | Prompt2Doc</title>
        <meta
          name="description"
          content="Collection of AI prompts for creating professional documents"
        />
      </Head>

      <TopNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Prompts Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use these pre-made prompts to get the best results from your AI
            assistant. Copy and customize them for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examplePrompts.map((prompt, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-4 text-2xl">
                  <span role="img" aria-label="lightbulb">
                    💡
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {prompt.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{prompt.description}</p>
              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-800 font-mono whitespace-pre-wrap">
                  {prompt.prompt}
                </pre>
                <button
                  onClick={() => copyPrompt(prompt.prompt)}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-md shadow-sm hover:shadow transition-shadow"
                >
                  <FiCopy className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Don&apos;t see what you&apos;re looking for? We&apos;re adding more
            prompts regularly.
          </p>
          <button
            onClick={() =>
              (window.location.href = "mailto:support@prompt2doc.com")
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Suggest a Prompt
          </button>
        </div>
      </main>
    </div>
  );
}
