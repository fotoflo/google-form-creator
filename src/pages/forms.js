import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../components/TopNav";
import { FiArrowRight } from "react-icons/fi";

export default function Forms() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard forms if they prefer
  const goToDashboard = () => {
    if (session) {
      router.push("/dashboard/forms");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 text-white font-sans">
      <Head>
        <title>Google Forms Creator | Prompt2Doc</title>
        <meta
          name="description"
          content="Create Google Forms easily with AI assistance"
        />
      </Head>

      <TopNav />

      <main className="max-w-7xl mx-auto px-8 py-16 ">
        <div className="mt-20"></div>
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Create Google Forms with AI
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Build professional forms, surveys, and quizzes in minutes using our
            AI-powered form generator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-white text-indigo-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 font-bold">
                  1
                </span>
                <p className="text-lg">
                  Describe the form you need or paste your content into our AI
                  prompt
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-indigo-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 font-bold">
                  2
                </span>
                <p className="text-lg">
                  Our AI analyzes your content and generates a structured Google
                  Form
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-indigo-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 font-bold">
                  3
                </span>
                <p className="text-lg">
                  Review and customize your form before publishing it to Google
                  Forms
                </p>
              </li>
            </ol>
          </div>

          <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-lg">
                <span className="text-green-300 mr-2">✓</span>
                Multiple question types (multiple choice, text, scale, etc.)
              </li>
              <li className="flex items-center text-lg">
                <span className="text-green-300 mr-2">✓</span>
                Section organization and form logic
              </li>
              <li className="flex items-center text-lg">
                <span className="text-green-300 mr-2">✓</span>
                Custom form themes and styling
              </li>
              <li className="flex items-center text-lg">
                <span className="text-green-300 mr-2">✓</span>
                Response validation and required fields
              </li>
              <li className="flex items-center text-lg">
                <span className="text-green-300 mr-2">✓</span>
                Direct integration with Google Forms
              </li>
            </ul>
          </div>
        </div>

        {session ? (
          <div className="text-center">
            <button
              onClick={goToDashboard}
              className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Create a Form Now <FiArrowRight className="ml-2" />
            </button>
            <p className="mt-4 text-sm opacity-80">
              You&apos;re signed in and ready to create forms!
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg">
              Sign in to start creating AI-powered forms
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
