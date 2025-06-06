import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiFileText, FiLayout, FiList, FiClock, FiPlus } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { SCOPES, ensureScope } from "../../utils/scopeManager";
import { SectionButton } from "../../components/SectionButton";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    // Fetch recent documents if user is authenticated
    if (session) {
      const fetchRecentDocuments = async () => {
        try {
          const response = await fetch("/api/getRecentResults");
          if (response.ok) {
            const data = await response.json();
            setRecentDocuments(data.results || []);
          }
        } catch (fetchError) {
          console.error("Error fetching recent documents:", fetchError);
        } finally {
          setLoading(false);
        }
      };

      fetchRecentDocuments();
    } else {
      setLoading(false);
    }
  }, [session, status, router]);

  const handleSectionClick = async (section) => {
    let hasRequiredScope = true;

    switch (section) {
      case "slides":
        hasRequiredScope = await ensureScope(SCOPES.SLIDES);
        if (hasRequiredScope) {
          router.push("/dashboard/slides/create");
        }
        break;

      case "forms":
        hasRequiredScope = await ensureScope(SCOPES.FORMS);
        if (hasRequiredScope) {
          router.push("/dashboard/forms");
        }
        break;

      case "documents":
        hasRequiredScope = await ensureScope(SCOPES.DRIVE);
        if (hasRequiredScope) {
          router.push("/dashboard/documents");
        }
        break;

      default:
        break;
    }
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  // If there's no session and it's not loading (and not unauthenticated due to redirect),
  // it's an unexpected state, but we should avoid crashing.
  // The useEffect for unauthenticated status should handle redirection.
  if (!session) {
    // Optionally, render a placeholder or null, or a more specific error.
    // For now, returning null to prevent rendering parts that depend on session.user.
    // The redirect for "unauthenticated" should ideally prevent this state from being visible for long.
    return null;
  }

  return (
    <DashboardLayout
      title="Dashboard"
      description="Create documents with AI using Prompt2Doc"
    >
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome, {session.user.name}
      </h1>
      <p className="text-gray-300 mb-8">What would you like to create today?</p>

      {/* Document creation options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SectionButton
          onClick={() => handleSectionClick("slides")}
          icon={<FiLayout className="w-6 h-6" />}
          title="Presentations"
          description="Create professional Google Slides presentations with AI-generated content and speaker notes."
        />

        <SectionButton
          onClick={() => handleSectionClick("forms")}
          icon={<FiList className="w-6 h-6" />}
          title="Forms"
          description="Generate Google Forms with customized questions and options for surveys, quizzes, and more."
        />

        <SectionButton
          onClick={() => handleSectionClick("documents")}
          icon={<FiFileText className="w-6 h-6" />}
          title="Documents"
          description="Draft Google Docs with AI assistance for reports, letters, articles, and other text documents."
        />
      </div>

      {/* Recent documents section */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Recent Documents
          </h2>
          <button
            onClick={() => router.push("/all-documents")}
            className="text-blue-300 hover:text-blue-200 flex items-center"
          >
            View All
          </button>
        </div>

        {loading ? (
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
                    {doc.type === "google-slides" && (
                      <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center text-blue-300">
                        <FiLayout className="w-5 h-5" />
                      </div>
                    )}
                    {doc.type === "google-form" && (
                      <div className="w-10 h-10 bg-purple-900 rounded-md flex items-center justify-center text-purple-300">
                        <FiList className="w-5 h-5" />
                      </div>
                    )}
                    {doc.type === "google-doc" && (
                      <div className="w-10 h-10 bg-green-900 rounded-md flex items-center justify-center text-green-300">
                        <FiFileText className="w-5 h-5" />
                      </div>
                    )}
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

      {/* Quick start section */}
      <div className="bg-indigo-800 rounded-lg shadow-md p-6 text-white mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
            <p className="mb-4 md:mb-0 max-w-xl text-gray-200">
              Not sure where to begin? Try creating a presentation about a topic
              of your choice. Our AI will help you generate professional slides
              in seconds.
            </p>
          </div>
          <button
            onClick={() => handleSectionClick("slides")}
            className="px-6 py-3 bg-white text-indigo-900 rounded-md hover:bg-gray-100 transition-colors flex items-center font-medium"
          >
            <FiPlus className="mr-2" /> New Presentation
          </button>
        </div>
      </div>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Prompt2Doc</p>
      </footer>
    </DashboardLayout>
  );
}
