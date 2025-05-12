import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { FiFileText, FiLayout, FiList, FiClock, FiPlus } from "react-icons/fi";
import TopNav from "../components/TopNav";
import Image from "next/image";
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

  const handleSectionClick = (section) => {
    switch (section) {
      case "slides":
        router.push("/slides/create");
        break;
      case "forms":
        router.push("/forms");
        break;
      case "documents":
        router.push("/documents");
        break;
      case "sheets":
        router.push("/sheets");
        break;
      default:
        break;
    }
  };

  // If loading session, show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white">
        <TopNav />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show new landing page
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-600 text-white font-sans overflow-x-hidden relative">
        {/* Animated Blobs Container to prevent overflow */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-0 right-[-15%] w-80 h-80 bg-purple-500 rounded-full filter blur-2xl opacity-40 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[30%] w-72 h-72 bg-blue-500 rounded-full filter blur-2xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <TopNav />

        {/* Hero with Split Layout */}
        <section className="relative z-10 mt-48 flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-8 mb-16 text-white">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-5xl font-extrabold leading-tight text-white">
              Turn AI Chats into
              <br />
              <span className="text-pink-300">Polished Documents</span>
            </h2>
            <p className="text-lg text-white font-medium">
              No more manual formatting. Copy, paste, and watch your ideas
              transform into Google Docs, Slides, Sheets or Forms—instantly.
            </p>
            <button
              onClick={() => signIn("google")}
              className="inline-block mt-4 px-6 py-3 bg-pink-400 text-white font-semibold rounded-full shadow-lg hover:bg-pink-300"
            >
              Try It Free
            </button>
          </div>
          <div className="md:w-1/2 mb-12 md:mb-0 flex justify-center">
            <Image
              src="/ai-doc-magic.png"
              alt="AI Document Magic"
              className="w-full max-w-lg md:max-w-lg rotate-6 drop-shadow-lg rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/320x320?text=AI+Doc+Magic";
              }}
              width={502}
              height={344}
            />
          </div>
        </section>

        {/* Features Showcase Carousel */}
        <section id="features" className="relative z-10 py-20 mb-16 text-white">
          <div className="max-w-7xl mx-auto px-8">
            <h3 className="text-4xl font-bold text-center mb-12 text-white">
              Why Prompt2Doc?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition text-white">
                <h4 className="text-2xl font-semibold mb-2 text-white">
                  ⚡ Lightning Fast
                </h4>
                <p className="font-medium text-white">
                  Format entire drafts in seconds, not hours.
                </p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition text-white">
                <h4 className="text-2xl font-semibold mb-2 text-white">
                  🎨 Customizable
                </h4>
                <p className="font-medium text-white">
                  Choose templates for corporate, creative, or academic styles.
                </p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition text-white">
                <h4 className="text-2xl font-semibold mb-2 text-white">
                  🌐 Anywhere Access
                </h4>
                <p className="font-medium text-white">
                  Works with Claude, ChatGPT, Llama, and more—no vendor lock-in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Split */}
        <section
          id="use-case"
          className="relative z-10 py-20 max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12 mb-16 text-white"
        >
          <div className="md:w-1/2">
            <Image
              src="/doc-types.png"
              alt="Team Working"
              className="rounded-lg shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x300?text=Team+Working";
              }}
              width={502}
              height={344}
            />
          </div>
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-3xl font-bold text-white">
              Perfect for Every Workflow
            </h3>
            <ul className="list-disc list-inside space-y-2 text-white font-medium">
              <li>Startup pitch decks without the sweat</li>
              <li>Academic papers auto-formatted to style guides</li>
              <li>Training manuals in minutes</li>
              <li>Client proposals that impress</li>
            </ul>
          </div>
        </section>

        {/* CTA & Prompt Block */}
        <section
          id="get-started"
          className="relative z-10 py-20 text-center max-w-7xl mx-auto px-8 mb-16 text-white"
        >
          <h3 className="text-3xl font-bold mb-6 text-white">
            Get Started in 3 Steps
          </h3>
          <div className="flex flex-col md:flex-row justify-center gap-12 mb-12 text-white">
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <p className="text-white font-medium">
                Chat with your favorite AI
              </p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <p className="text-white font-medium">Use our magic prompt</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <p className="text-white font-medium">Paste & create instantly</p>
            </div>
          </div>
          <div className="inline-block text-left mx-auto max-w-2xl w-full">
            <textarea
              readOnly
              className="w-full p-4 rounded-lg bg-white bg-opacity-10 text-gray-900 text-sm font-mono caret-transparent border border-white/20 placeholder-white resize-none"
              value={
                "Please structure the following content for a [Google Doc/Presentation/Form/Sheet]: [Paste here]. Format it for Prompt2Doc conversion—sections, headings, lists, and styles included."
              }
            />
            <button
              className="mt-4 bg-pink-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-300 shadow-lg"
              onClick={() => {
                navigator.clipboard.writeText(
                  "Please structure the following content for a [Google Doc/Presentation/Form/Sheet]: [Paste here]. Format it for Prompt2Doc conversion—sections, headings, lists, and styles included."
                );
              }}
            >
              Copy Prompt
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Prompt2Doc. Crafted with 💜</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-white font-semibold">
              Privacy
            </a>
            <a href="#" className="hover:text-white font-semibold">
              Terms
            </a>
            <a href="#" className="hover:text-white font-semibold">
              Support
            </a>
          </div>
        </footer>

        {/* Blob Animation CSS */}
        <style jsx global>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 8s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Dashboard | Prompt2Doc</title>
        <meta
          name="description"
          content="Create documents with AI using Prompt2Doc"
        />
      </Head>

      <TopNav />

      <main className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {session.user.name}
        </h1>
        <p className="text-gray-600 mb-8">
          What would you like to create today?
        </p>

        {/* Document creation options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            onClick={() => handleSectionClick("slides")}
            className="bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 mr-4">
                <FiLayout className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Presentations
              </h2>
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
            onClick={() => handleSectionClick("forms")}
            className="bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center text-purple-300 mr-4">
                <FiList className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Forms</h2>
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
            onClick={() => handleSectionClick("documents")}
            className="bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center text-green-300 mr-4">
                <FiFileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
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
        <div className="bg-gray-200 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Documents
            </h2>
            <button
              onClick={() => router.push("/all-documents")}
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : recentDocuments.length > 0 ? (
            <div className="divide-y divide-gray-300">
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
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(doc.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/result?id=${doc.id}`)}
                    className="px-3 py-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 transition-colors text-sm"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <FiClock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No recent documents found.</p>
              <p className="text-sm mt-2">
                Create your first document to see it here!
              </p>
            </div>
          )}
        </div>

        {/* Quick start section */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg shadow-md p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
              <p className="mb-4 md:mb-0 max-w-xl text-gray-200">
                Not sure where to begin? Try creating a presentation about a
                topic of your choice. Our AI will help you generate professional
                slides in seconds.
              </p>
            </div>
            <button
              onClick={() => handleSectionClick("slides")}
              className="px-6 py-3 bg-white text-blue-900 rounded-md hover:bg-gray-100 transition-colors flex items-center"
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
