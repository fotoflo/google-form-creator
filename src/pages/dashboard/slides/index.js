import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiArrowRight, FiClock, FiPlus, FiSliders } from "react-icons/fi";
import DashboardLayout from "../../../components/DashboardLayout";

export default function Slides() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSlides, setRecentSlides] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Fetch recent slides when component mounts
  useEffect(() => {
    const fetchRecentSlides = async () => {
      try {
        const response = await fetch(
          "/api/getRecentResults?type=google-slides"
        );
        if (response.ok) {
          const data = await response.json();
          setRecentSlides(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching recent slides:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    if (session) {
      fetchRecentSlides();
    } else {
      setLoadingRecent(false);
    }
  }, [session]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/createSlides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create slides");
      }

      const data = await response.json();
      router.push(`/result?id=${data.resultId}`);
    } catch (error) {
      console.error("Error creating slides:", error);
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <DashboardLayout
      title="Presentations"
      description="Create and manage your AI-generated presentations"
    >
      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Presentations</h1>
          <p className="text-gray-300">
            Create professional Google Slides presentations with AI assistance
          </p>
        </div>

        {/* Create presentation card */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Create a New Presentation
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-white text-lg mb-2">
                What would you like your presentation to be about?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a detailed description of the presentation you want to create. For example: 'Create a 10-slide presentation about climate change, its causes, effects, and potential solutions.'"
                className="w-full h-32 px-4 py-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-sm text-white placeholder-gray-400 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className={`flex items-center gap-2 px-6 py-3 bg-white text-purple-900 rounded-md hover:bg-gray-100 transition-colors ${
                  (isLoading || !prompt.trim()) &&
                  "opacity-70 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiArrowRight /> Create Presentation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Advanced options card */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Advanced Options
            </h2>
            <FiSliders className="text-pink-300 w-5 h-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => router.push("/dashboard/slides/create")}
              className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] transition-colors p-5 rounded-lg cursor-pointer border border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mr-3">
                  <FiPlus className="text-blue-300 w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Custom Creation
                </h3>
              </div>
              <p className="text-gray-300">
                Create a presentation with more detailed options and
                customization
              </p>
            </div>

            <div
              onClick={() => router.push("/dashboard/prompts")}
              className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] transition-colors p-5 rounded-lg cursor-pointer border border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mr-3">
                  <span className="text-purple-300">💡</span>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Saved Prompts
                </h3>
              </div>
              <p className="text-gray-300">
                Use your saved prompts to quickly generate presentations
              </p>
            </div>
          </div>
        </div>

        {/* Recent presentations */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Presentations
          </h2>

          {loadingRecent ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : recentSlides.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {recentSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-10 h-10 bg-blue-900/50 rounded-md flex items-center justify-center text-blue-300">
                        <FiSliders className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{slide.title}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(slide.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/result?id=${slide.id}`)}
                    className="px-3 py-1 bg-[rgba(255,255,255,0.1)] text-white rounded hover:bg-[rgba(255,255,255,0.2)] transition-colors text-sm"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FiClock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No recent presentations found.</p>
              <p className="text-sm mt-2">
                Create your first presentation to see it here!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
