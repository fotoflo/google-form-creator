import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiArrowRight, FiClock, FiGrid } from "react-icons/fi";
import DashboardLayout from "../../../components/DashboardLayout";

export default function Sheets() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSheets, setRecentSheets] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Fetch recent sheets when component mounts
  useEffect(() => {
    const fetchRecentSheets = async () => {
      try {
        const response = await fetch("/api/getRecentResults?type=google-sheet");
        if (response.ok) {
          const data = await response.json();
          setRecentSheets(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching recent sheets:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    if (session) {
      fetchRecentSheets();
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
      const response = await fetch("/api/createSheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create sheet");
      }

      const data = await response.json();
      router.push(`/result?id=${data.resultId}`);
    } catch (error) {
      console.error("Error creating sheet:", error);
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
      title="Spreadsheets"
      description="Create and manage your AI-generated spreadsheets"
    >
      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Spreadsheets</h1>
          <p className="text-gray-300">
            Create powerful Google Sheets with AI assistance for data
            organization and analysis
          </p>
        </div>

        {/* Create spreadsheet card */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Create a New Spreadsheet
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-white text-lg mb-2">
                What would you like your spreadsheet to contain?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a detailed description of the spreadsheet you want to create. For example: 'Create a monthly budget tracker with income sources, expense categories, and savings calculations.'"
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
                    <FiArrowRight /> Create Spreadsheet
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
              Template Gallery
            </h2>
            <FiGrid className="text-pink-300 w-5 h-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Budget Tracker",
              "Project Management",
              "Inventory System",
              "Event Planning",
              "Fitness Tracker",
              "Meal Planner",
            ].map((template) => (
              <div
                key={template}
                onClick={() =>
                  setPrompt(
                    `Create a ${template.toLowerCase()} spreadsheet with all necessary formulas and formatting.`
                  )
                }
                className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] transition-colors p-4 rounded-lg cursor-pointer border border-[rgba(255,255,255,0.1)] text-center"
              >
                <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center mx-auto mb-3">
                  <FiGrid className="text-green-300 w-5 h-5" />
                </div>
                <h3 className="text-white font-medium">{template}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Recent spreadsheets */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Spreadsheets
          </h2>

          {loadingRecent ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : recentSheets.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {recentSheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-10 h-10 bg-green-900/50 rounded-md flex items-center justify-center text-green-300">
                        <FiGrid className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{sheet.title}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(sheet.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/result?id=${sheet.id}`)}
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
              <p className="text-lg">No recent spreadsheets found.</p>
              <p className="text-sm mt-2">
                Create your first spreadsheet to see it here!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
