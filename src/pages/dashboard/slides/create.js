import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CreateSlides() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Create Presentation"
      description="Create a new Google Slides presentation with AI assistance"
    >
      <h1 className="text-3xl font-bold text-white mb-4">
        Create a New Presentation
      </h1>
      import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import { useSession } from "next-auth/react";
import { SkeletonForm } from "../../components/Skeleton";
import LoginModal from "../../components/LoginModal";
import {
  generateSlidesPrompt,
  getExampleMarkdown,
} from "../../utils/slidePrompts";
import Head from "next/head";
import TopNav from "../../components/TopNav";

export default function CreateSlides() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "My Presentation",
    markdownContent: "",
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Get the example markdown for the instructions
  const exampleMarkdown = getExampleMarkdown();

  // Generate the prompt using the utility function
  const promptToCopy = generateSlidesPrompt(formData);

  // Handle URL parameters for pre-filled content
  useEffect(() => {
    if (router.query.prompt) {
      setFormData((prev) => ({
        ...prev,
        markdownContent: decodeURIComponent(router.query.prompt),
      }));
    }
  }, [router.query.prompt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }

    // Validate form
    if (!formData.title.trim()) {
      setError("Please enter a presentation title");
      return;
    }

    if (!formData.markdownContent.trim()) {
      setError("Please enter your presentation content");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/createSlides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to create slides";
        const errorDetails = responseData.details || "";
        setError(
          `${errorMessage}${errorDetails ? `\n\nDetails: ${errorDetails}` : ""}`
        );
        console.error("API Error:", responseData);
        return;
      }

      if (responseData.presentationUrl) {
        window.open(responseData.presentationUrl, "_blank");
        router.push(`/result?id=${responseData.id}`);
      } else {
        router.push(`/result?id=${responseData.id}`);
      }
    } catch (err) {
      console.error("Error creating slides:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>Create Google Slides | AI Document Creator</title>
        <meta
          name="description"
          content="Create Google Slides presentations with AI"
        />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4 mt-20">
        {status === "loading" ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-white">
              Create Google Slides Presentation
            </h1>
            <SkeletonForm />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-white">
              Create Google Slides Presentation
            </h1>

            <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="font-medium mb-2 text-white">Use ChatGPT</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Copy this prompt to ChatGPT, then paste the JSON response
                    into our result page.
                  </p>

                  <div className="relative">
                    <textarea
                      readOnly
                      value={promptToCopy}
                      className="w-full h-32 p-3 bg-[rgba(0,0,0,0.2)] border border-white/10 rounded-md font-mono text-sm text-white/90"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(promptToCopy);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2000);
                      }}
                      className="absolute top-2 right-2 px-2 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Presentation Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[rgba(0,0,0,0.2)] border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-white"
                    placeholder="Enter a title for your presentation"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="markdownContent"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Presentation Content (Markdown)
                  </label>
                  <div className="mb-2 text-sm text-white/80">
                    Use markdown format with &quot;===SLIDE===&quot; to separate
                    slides.{" "}
                    <button
                      type="button"
                      className="text-pink-200 underline"
                      onClick={() => setShowInstructions(!showInstructions)}
                    >
                      {showInstructions ? "Hide" : "Show"} formatting
                      instructions
                    </button>
                  </div>

                  {showInstructions && (
                    <div className="mb-4 p-4 bg-[rgba(0,0,0,0.2)] rounded-md text-sm text-white/90">
                      <h3 className="font-semibold mb-2">
                        Markdown Instructions:
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Use &quot;# Title&quot; for slide titles</li>
                        <li>Use &quot;- Point&quot; for bullet points</li>
                        <li>Use &quot;1. Point&quot; for numbered lists</li>
                        <li>
                          Use &quot;===SLIDE===&quot; on a new line to separate
                          slides
                        </li>
                        <li>
                          For speaker notes, use either:
                          <ul className="list-disc pl-5 mt-1">
                            <li>
                              <code className="bg-black/20 px-1 rounded">
                                &gt; Your speaker note
                              </code>{" "}
                              (simple format)
                            </li>
                            <li>
                              Or for multi-line notes:
                              <pre className="mt-1 text-xs bg-black/20 p-1 rounded">
                                &gt;&gt;&gt; SPEAKER NOTES &gt;&gt;&gt;{"\n"}
                                Your multi-line notes here....{"\n"}
                                More notes on another line{"\n"}
                                &lt;&lt;&lt; SPEAKER NOTES &lt;&lt;&lt;
                              </pre>
                            </li>
                          </ul>
                        </li>
                        <li>
                          For image prompts, use either:
                          <ul className="list-disc pl-5 mt-1">
                            <li>
                              <code className="bg-black/20 px-1 rounded">
                                !&gt; Your image prompt
                              </code>{" "}
                              (simple format)
                            </li>
                            <li>
                              Or for multi-line prompts:
                              <pre className="mt-1 text-xs bg-black/20 p-1 rounded">
                                &lt;IMAGE PROMPT&gt;{"\n"}
                                Your image prompt here....{"\n"}
                                More details on another line{"\n"}
                                &lt;/IMAGE PROMPT&gt;
                              </pre>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <div className="mt-2 p-2 bg-black/20 rounded">
                        <pre className="text-xs text-white/90">
                          {exampleMarkdown}
                        </pre>
                      </div>
                    </div>
                  )}

                  <textarea
                    id="markdownContent"
                    name="markdownContent"
                    value={formData.markdownContent}
                    onChange={handleChange}
                    rows="12"
                    className="w-full px-3 py-2 bg-[rgba(0,0,0,0.2)] border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-white font-mono"
                    placeholder="# Slide 1 Title
- Bullet point 1
- Bullet point 2

===SLIDE===

# Slide 2 Title
1. Numbered point 1
2. Numbered point 2"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-md text-white">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Presentation"}
                  </button>
                </div>
              </form>
            </div>

            {showToast && (
              <div className="fixed bottom-4 right-4 bg-white text-purple-700 px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
                Prompt copied to clipboard!
              </div>
            )}

            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            />
          </>
        )}
      </main>
    </div>
  );
}

      {/* Rest of your slides creation page content */}
    </DashboardLayout>
  );
}
