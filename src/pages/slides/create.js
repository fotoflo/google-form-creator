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
  const { data: session, status } = useSession();
  const router = useRouter();
  const { prompt: initialPrompt } = router.query;

  const [slideData, setSlideData] = useState({
    title: "",
    prompt: initialPrompt || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Get the example markdown for the instructions
  const exampleMarkdown = getExampleMarkdown();

  // Generate the prompt using the utility function
  const promptToCopy = generateSlidesPrompt(slideData);

  useEffect(() => {
    if (initialPrompt) {
      setSlideData((prev) => ({ ...prev, prompt: initialPrompt }));
    }
  }, [initialPrompt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSlideData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push("/");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/createSlides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slideData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create presentation");
      }

      // Redirect to the result page
      router.push(`/result?id=${data.resultId}`);
    } catch (err) {
      console.error("Error creating presentation:", err);
      setError(
        err.message || "An error occurred while creating the presentation"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>Create Presentation | Prompt2Doc</title>
        <meta
          name="description"
          content="Create Google Slides presentations with AI assistance"
        />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Create a Presentation
        </h1>

        {status === "loading" ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
                {error}
              </div>
            )}

            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-6 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-white font-medium mb-2"
                  >
                    Presentation Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={slideData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[rgba(0,0,0,0.2)] text-white placeholder-gray-300 border-gray-600"
                    placeholder="Enter a title for your presentation"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="prompt"
                    className="block text-white font-medium mb-2"
                  >
                    What would you like your presentation to cover?
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    value={slideData.prompt}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[rgba(0,0,0,0.2)] text-white placeholder-gray-300 border-gray-600"
                    placeholder="Describe the presentation you want to create. For example: 'A project kickoff presentation for our new mobile app, including project goals, timeline, team roles, and next steps.'"
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading
                      ? "Creating Presentation..."
                      : "Create Presentation"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">
                Use ChatGPT to generate slides
              </h2>
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

            {showToast && (
              <div className="fixed bottom-4 right-4 bg-white text-purple-700 px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
                Prompt copied to clipboard!
              </div>
            )}

            <LoginModal
              isOpen={!session && !loading}
              onClose={() => setShowLoginModal(true)}
            />
          </>
        )}
      </main>
    </div>
  );
}
