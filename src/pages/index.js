import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { FiFileText, FiLayout, FiList, FiClock, FiPlus } from "react-icons/fi";
import TopNav from "../components/TopNav";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [session]);

  // If loading session, show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Head>
          <title>Prompt2Doc - AI Document Creator</title>
          <meta
            name="description"
            content="Create documents with AI using Prompt2Doc"
          />
        </Head>

        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Prompt2Doc
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The AI document creator that lets you prompt and develop documents
            on your own AI, and then convert them to Google Docs, Slides, and
            Forms. Create professional presentations, forms, and documents with
            just a few clicks.
          </p>
          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
          >
            Sign in to Get Started
          </button>
        </div>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | Prompt2Doc</title>
        <meta
          name="description"
          content="Create documents with AI using Prompt2Doc"
        />
      </Head>

      <TopNav />

      <main className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {session.user.name}
        </h1>
        <p className="text-gray-600 mb-8">
          What would you like to create today?
        </p>

        {/* Document creation options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            onClick={() => router.push("/slides")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                <FiLayout className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">Presentations</h2>
            </div>
            <p className="text-gray-600">
              Create professional Google Slides presentations with AI-generated
              content and speaker notes.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full">
              Create Presentation
            </button>
          </div>

          <div
            onClick={() => router.push("/forms")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                <FiList className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">Forms</h2>
            </div>
            <p className="text-gray-600">
              Generate Google Forms with customized questions and options for
              surveys, quizzes, and more.
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors w-full">
              Create Form
            </button>
          </div>

          <div
            onClick={() => router.push("/documents")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                <FiFileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">Documents</h2>
            </div>
            <p className="text-gray-600">
              Draft Google Docs with AI assistance for reports, letters,
              articles, and other text documents.
            </p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full">
              Create Document
            </button>
          </div>
        </div>

        {/* Recent documents section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Documents</h2>
            <button
              onClick={() => router.push("/all-documents")}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : recentDocuments.length > 0 ? (
            <div className="divide-y">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      {doc.type === "google-slides" && (
                        <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                          <FiLayout className="w-5 h-5" />
                        </div>
                      )}
                      {doc.type === "google-form" && (
                        <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600">
                          <FiList className="w-5 h-5" />
                        </div>
                      )}
                      {doc.type === "google-doc" && (
                        <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-600">
                          <FiFileText className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/result?id=${doc.id}`)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiClock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No recent documents found.</p>
              <p className="text-sm mt-2">
                Create your first document to see it here!
              </p>
            </div>
          )}
        </div>

        {/* Quick start section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
              <p className="mb-4 md:mb-0 max-w-xl">
                Not sure where to begin? Try creating a presentation about a
                topic of your choice. Our AI will help you generate professional
                slides in seconds.
              </p>
            </div>
            <button
              onClick={() => router.push("/slides")}
              className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" /> New Presentation
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Prompt2Doc</p>
      </footer>
    </div>
  );
}
