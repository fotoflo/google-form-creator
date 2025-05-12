import { useState } from "react";
import Head from "next/head";
import TopNav from "../components/TopNav";
import { FiCopy } from "react-icons/fi";

export default function Prompts() {
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  const copyPrompt = (prompt, index) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSuggestPrompt = (e) => {
    e.preventDefault();
    window.location.href = "mailto:support@prompt2doc.com";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>AI Prompts | Prompt2Doc</title>
        <meta
          name="description"
          content="Collection of AI prompts for creating professional documents"
        />
      </Head>

      <TopNav />

      <main className="max-w-6xl mx-auto px-4 py-8 mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Prompts Collection
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Use these pre-made prompts to get the best results from your AI
            assistant. Copy and customize them for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examplePrompts.map((promptData, index) => (
            <div
              key={index}
              className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10 rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {promptData.title}
              </h3>
              <p className="text-white/80 mb-4">{promptData.description}</p>
              <div className="relative">
                <pre className="bg-[rgba(0,0,0,0.2)] p-4 rounded-md text-white/90 text-sm font-mono whitespace-pre-wrap mb-2">
                  {promptData.prompt}
                </pre>
                <button
                  onClick={() => copyPrompt(promptData.prompt, index)}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors group"
                  title="Copy prompt"
                >
                  <FiCopy className="w-4 h-4 text-white" />
                  {copiedIndex === index && (
                    <span className="absolute -top-8 right-0 bg-black/75 text-white text-xs px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/80 mb-4">
            Don&apos;t see what you&apos;re looking for? We&apos;re adding more
            prompts regularly.
          </p>
          <button
            onClick={handleSuggestPrompt}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Suggest a Prompt
          </button>
        </div>
      </main>
    </div>
  );
}
