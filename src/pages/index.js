import { useState, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { getGptFormPrompt, getSampleFormJson } from "../utils/formPrompts";
import { validateFormJson } from "../utils/formValidation";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Head from "next/head";
import { FiFileText, FiLayout, FiList, FiClock, FiPlus } from "react-icons/fi";
import TopNav from "../components/TopNav";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // 'create', 'templates', 'guide'
  const promptRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    // Fetch recent documents if user is authenticated
    if (session) {
      const fetchRecentDocuments = async () => {
        try {
          const response = await fetch("/api/getRecentResults");
          if (response.ok) {
            const data = await response.json();
            setRecentDocuments(data.results || []);
          }
        } catch (error) {
          console.error("Error fetching recent documents:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecentDocuments();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormUrl("");
    setIsLoading(true);

    try {
      // Validate form name
      if (!formName.trim()) {
        throw new Error("Please enter a form name");
      }

      // Validate JSON
      const validation = validateFormJson(jsonData);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const response = await fetch("/api/create-form", {
        method: "POST",
        body: JSON.stringify({ formName, jsonData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create form");
      }

      setFormUrl(data.formUrl);
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleJson = () => {
    setJsonData(JSON.stringify(getSampleFormJson(), null, 2));
  };

  const copyPromptToClipboard = () => {
    if (promptRef.current) {
      navigator.clipboard.writeText(promptRef.current.textContent);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  // Sample templates for different form types
  const formTemplates = [
    {
      name: "Customer Feedback",
      description: "Collect feedback about your product or service",
      json: [
        {
          title: "How would you rate our service?",
          type: "multipleChoice",
          required: true,
          options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
        },
        {
          title: "What did you like most about our service?",
          type: "paragraph",
          required: false,
        },
        {
          title: "What could we improve?",
          type: "paragraph",
          required: false,
        },
        {
          title: "Would you recommend us to others?",
          type: "multipleChoice",
          required: true,
          options: [
            "Definitely",
            "Probably",
            "Not sure",
            "Probably not",
            "Definitely not",
          ],
        },
      ],
    },
    {
      name: "Event Registration",
      description: "Register attendees for your event",
      json: [
        {
          title: "Full Name",
          type: "text",
          required: true,
        },
        {
          title: "Email Address",
          type: "text",
          required: true,
        },
        {
          title: "Which sessions will you attend?",
          type: "checkboxes",
          required: true,
          options: [
            "Morning Keynote",
            "Workshop A",
            "Workshop B",
            "Networking Lunch",
            "Afternoon Panel",
            "Closing Remarks",
          ],
        },
        {
          title: "Dietary Restrictions",
          type: "multipleChoice",
          required: false,
          options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"],
        },
        {
          title: "Any additional information we should know?",
          type: "paragraph",
          required: false,
        },
      ],
    },
    {
      name: "Job Application",
      description: "Collect applications for a job opening",
      json: [
        {
          title: "Full Name",
          type: "text",
          required: true,
        },
        {
          title: "Email",
          type: "text",
          required: true,
        },
        {
          title: "Phone Number",
          type: "text",
          required: true,
        },
        {
          title: "Resume/CV Link",
          type: "text",
          description:
            "Provide a link to your resume (Google Drive, Dropbox, etc.)",
          required: true,
        },
        {
          title: "Years of Experience",
          type: "dropdown",
          required: true,
          options: [
            "Less than 1 year",
            "1-2 years",
            "3-5 years",
            "5-10 years",
            "10+ years",
          ],
        },
        {
          title: "Why are you interested in this position?",
          type: "paragraph",
          required: true,
        },
      ],
    },
  ];

  // Content for unauthenticated users
  const unauthenticatedContent = (
    <div className="text-center py-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Welcome to Google Forms Creator
      </h2>
      <p className="mb-6 text-gray-600">
        Create custom Google Forms quickly using JSON or pre-built templates
      </p>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-bold text-lg mb-2 text-blue-700">
            🚀 Quick Creation
          </h3>
          <p className="text-blue-600">
            Convert JSON to Google Forms with a single click
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-bold text-lg mb-2 text-green-700">
            📋 Templates
          </h3>
          <p className="text-green-600">
            Use pre-built templates for common form types
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-bold text-lg mb-2 text-purple-700">
            🤖 AI Assistance
          </h3>
          <p className="text-purple-600">
            Generate forms with AI using our ChatGPT prompts
          </p>
        </div>
      </div>

      <p className="mb-4 text-gray-700">
        Please sign in with Google to create forms
      </p>
      <button
        onClick={() => signIn("google")}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
      >
        Sign in with Google
      </button>
    </div>
  );

  // Content for authenticated users
  const authenticatedContent = (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("create")}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "create"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Create Form
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "templates"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "guide"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          How It Works
        </button>
      </div>

      {/* Create Form Tab */}
      {activeTab === "create" && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="formName"
                className="block text-gray-700 font-medium mb-2"
              >
                Form Name
              </label>
              <input
                type="text"
                id="formName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Enter form name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="jsonData"
                className="block text-gray-700 font-medium mb-2"
              >
                Form JSON Data
              </label>
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={loadSampleJson}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Load Sample JSON
                </button>
              </div>
              <textarea
                id="jsonData"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-100"
                rows="10"
                placeholder="Paste your JSON data here"
                required
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Google Form"}
              </button>
            </div>
          </form>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded mt-8">
            <h3 className="font-bold text-blue-800 mb-2">
              Paste the following prompt to ChatGPT or your AI of choice to
              generate a form structure:
            </h3>
            <p className="mb-3 text-sm text-blue-700">
              This prompt will help you create the perfect form JSON structure.
            </p>
            <div className="relative">
              <pre
                ref={promptRef}
                className="bg-gray-800 text-gray-200 p-3 rounded text-xs overflow-auto max-h-40"
              >
                {getGptFormPrompt()}
              </pre>
              <button
                onClick={copyPromptToClipboard}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
              >
                {promptCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div>
          <p className="text-gray-600 mb-6">
            Choose a template below to quickly create a form. Click on a
            template to load its JSON structure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formTemplates.map((template, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow hover:border-blue-300"
                onClick={() => {
                  setFormName(template.name);
                  setJsonData(JSON.stringify(template.json, null, 2));
                  setActiveTab("create");
                }}
              >
                <h3 className="font-bold text-lg mb-1 text-gray-800">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {template.description}
                </p>
                <p className="text-xs text-blue-500">
                  {template.json.length} questions
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works Tab */}
      {activeTab === "guide" && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            How to Create Forms with JSON
          </h2>

          <p className="text-gray-600 mb-4">
            Google Forms Creator allows you to quickly create forms by providing
            a JSON structure. Follow these steps to create your form:
          </p>

          <ol className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
            <li>
              <strong>Define your form structure</strong> - Create a JSON array
              where each object represents a question
            </li>
            <li>
              <strong>Choose question types</strong> - Supported types: text,
              paragraph, multipleChoice, checkboxes, dropdown
            </li>
            <li>
              <strong>Add options for choice questions</strong> - For
              multipleChoice, checkboxes, and dropdown types
            </li>
            <li>
              <strong>Set required fields</strong> - Mark questions as required
              with the required property
            </li>
            <li>
              <strong>Create your form</strong> - Click &quot;Create Google
              Form&quot; to generate your form
            </li>
          </ol>

          <h3 className="text-lg font-bold mb-2 text-gray-800">
            JSON Structure
          </h3>

          <p className="text-gray-600 mb-2">
            Each question in your form should follow this structure:
          </p>

          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mb-6">
            {`{
  "title": "Question text here",
  "type": "text", // Options: text, paragraph, multipleChoice, checkboxes, dropdown
  "description": "Optional description text",
  "required": true, // or false
  "options": ["Option 1", "Option 2", "Option 3"] // Only for multipleChoice, checkboxes, dropdown
}`}
          </pre>

          <h3 className="text-lg font-bold mb-2 text-gray-800">
            Using AI to Generate Forms
          </h3>

          <p className="text-gray-600 mb-2">
            You can use the provided ChatGPT prompt to generate form JSON. The
            prompt will guide you through:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Defining your form&apos;s purpose</li>
            <li>Determining the appropriate length</li>
            <li>Generating relevant questions</li>
            <li>Converting to the required JSON format</li>
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error Creating Form</h3>
          <p>{error}</p>
          <div className="mt-3 text-sm">
            <p className="font-semibold">Common solutions:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Check that your JSON is properly formatted</li>
              <li>Ensure all required fields are included for each question</li>
              <li>Verify your Google account has permission to create forms</li>
              <li>Try signing out and signing back in</li>
            </ul>
          </div>
        </div>
      )}

      {formUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-800 mb-2">
            Form Created Successfully!
          </h3>
          <p className="mb-2">Your Google Form is ready:</p>
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 break-all"
          >
            {formUrl}
          </a>
        </div>
      )}
    </div>
  );

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
          <title>AI Document Creator</title>
          <meta name="description" content="Create documents with AI" />
        </Head>

        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Prompt2Doc
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The AI document creator that lets you prompt and develop documents
            on your own AI, and then convert them to Google Docs, Slides, and
            Forms. Create professional presentations, forms, and documents with
            just a few clicks
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
        <title>Dashboard | AI Document Creator</title>
        <meta name="description" content="Create documents with AI" />
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
        <p>© {new Date().getFullYear()} AI Document Creator</p>
      </footer>
    </div>
  );
}
