import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiArrowRight, FiClock, FiFileText } from "react-icons/fi";
import DashboardLayout from "../../../components/DashboardLayout";

export default function Documents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Fetch recent documents when component mounts
  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        const response = await fetch("/api/getRecentResults?type=google-doc");
        if (response.ok) {
          const data = await response.json();
          setRecentDocuments(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching recent documents:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    if (session) {
      fetchRecentDocuments();
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
      const response = await fetch("/api/createDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const data = await response.json();
      router.push(`/result?id=${data.resultId}`);
    } catch (error) {
      console.error("Error creating document:", error);
      setIsLoading(false);
    }
  };

  // if (status === "loading") {
  //   return (
  //     <DashboardLayout>
  //       <div className="flex justify-center items-center h-[60vh]">
  //         <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <DashboardLayout
      title="Documents"
      description="Create and manage your AI-generated documents"
    >
      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-gray-300">
            Create professional Google Docs with AI-generated content
          </p>
        </div>

        {/* Create document card */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Create a New Document
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-white text-lg mb-2">
                What would you like your document to be about?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a detailed description of the document you want to create. For example: 'Write a comprehensive report on renewable energy sources, their benefits, challenges, and future outlook.'"
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
                    <FiArrowRight /> Create Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Document templates */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Document Templates
            </h2>
            <FiFileText className="text-pink-300 w-5 h-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Business Report",
              "Research Paper",
              "Project Proposal",
              "Meeting Minutes",
              "Resume/CV",
              "Cover Letter",
            ].map((template) => (
              <div
                key={template}
                onClick={() =>
                  setPrompt(
                    `Create a professional ${template.toLowerCase()} with all necessary sections and formatting.`
                  )
                }
                className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] transition-colors p-4 rounded-lg cursor-pointer border border-[rgba(255,255,255,0.1)] text-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mx-auto mb-3">
                  <FiFileText className="text-blue-300 w-5 h-5" />
                </div>
                <h3 className="text-white font-medium">{template}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Recent documents */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Documents
          </h2>

          {loadingRecent ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : recentDocuments.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-10 h-10 bg-blue-900/50 rounded-md flex items-center justify-center text-blue-300">
                        <FiFileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{doc.title}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(doc.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/result?id=${doc.id}`)}
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
              <p className="text-lg">No recent documents found.</p>
              <p className="text-sm mt-2">
                Create your first document to see it here!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
