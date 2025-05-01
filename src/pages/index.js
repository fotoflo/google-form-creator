import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FiFileText, FiLayout, FiList, FiClock, FiPlus } from "react-icons/fi";
import TopNav from "../components/TopNav";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promptCopied, setPromptCopied] = useState(false);

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

  const copyPrompt = () => {
    const prompt = `Please help me structure the following content for a [Google Doc/Presentation/Form/Sheet]:

[Paste your content or describe what you need]

Format your response in a way that's optimized for Prompt2Doc to convert into a professional document. Include all necessary sections, formatting, and organization.`;

    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  // If loading session, show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, show new landing page
  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Head>
          <title>Prompt2Doc - AI Document Creator</title>
          <meta
            name="description"
            content="Turn AI conversations into professional Google documents"
          />
        </Head>

        <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-gray-900"
          >
            <span className="mr-2">📄</span>
            Prompt2Doc
          </Link>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <Link
                href="/documents"
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <span className="mr-2">📝</span>
                Docs
              </Link>
              <Link
                href="/sheets"
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <span className="mr-2">📊</span>
                Sheets
              </Link>
              <Link
                href="/slides"
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <span className="mr-2">🖼️</span>
                Slides
              </Link>
              <Link
                href="/forms"
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <span className="mr-2">📋</span>
                Forms
              </Link>
            </div>
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Sign in to Get Started
            </button>
          </div>
        </nav>

        <section className="py-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Prompt2Doc
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Turn conversations with any AI into professional Google documents
            with just a few clicks. Works with Claude, ChatGPT, Llama, and more!
          </p>

          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold mb-2">
                C
              </div>
              <span className="text-gray-400 text-sm">Claude</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mb-2">
                G
              </div>
              <span className="text-gray-400 text-sm">ChatGPT</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-2">
                L
              </div>
              <span className="text-gray-400 text-sm">Llama</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google")}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
          >
            Sign in to Get Started
          </button>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Chat with Any AI",
                description:
                  "Have in-depth conversations with Claude, ChatGPT, or your preferred AI assistant about your project needs.",
              },
              {
                step: 2,
                title: "Use Our Special Prompt",
                description:
                  "Copy our specially designed prompt and ask your AI to format your content for Google Docs, Slides, Forms, or Sheets.",
              },
              {
                step: 3,
                title: "Paste & Create",
                description:
                  "Paste the AI-formatted content into Prompt2Doc and we'll automatically generate your professional documents.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-lg shadow-sm relative"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Get Started with Our AI Prompt
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm relative max-w-3xl mx-auto border border-gray-200">
              <pre className="text-gray-600 font-mono text-sm whitespace-pre-wrap">
                Please help me structure the following content for a [Google
                Doc/Presentation/Form/Sheet]: [Paste your content or describe
                what you need] Format your response in a way that's optimized
                for Prompt2Doc to convert into a professional document. Include
                all necessary sections, formatting, and organization.
              </pre>
              <button
                onClick={copyPrompt}
                className="absolute top-4 right-4 px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {promptCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </section>

        <footer className="py-6 text-center text-gray-500 text-sm bg-gray-50">
          <p>© {new Date().getFullYear()} Prompt2Doc</p>
        </footer>
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
            onClick={() => router.push("/slides")}
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
            onClick={() => router.push("/forms")}
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
            onClick={() => router.push("/documents")}
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
              onClick={() => router.push("/slides")}
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
