import { useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { getGptFormPrompt, getSampleFormJson } from "../utils/formPrompts";
import { validateFormJson } from "../utils/formValidation";

export default function Home() {
  const { data: session, status } = useSession();
  const [formName, setFormName] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const promptRef = useRef(null);

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

  // Get the prompt and sample JSON from our utility functions
  const gptPrompt = getGptFormPrompt();
  const sampleJson = JSON.stringify(getSampleFormJson(), null, 2);

  const copyPromptToClipboard = () => {
    if (promptRef.current) {
      navigator.clipboard.writeText(promptRef.current.textContent);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Head>
        <title>Google Forms Creator</title>
        <meta name="description" content="Create Google Forms from JSON" />
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Google Forms Creator
      </h1>

      {status === "loading" && (
        <div className="text-center py-4">Loading...</div>
      )}

      {status === "unauthenticated" && (
        <div className="text-center py-8">
          <p className="mb-4">Please sign in with Google to create forms</p>
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-3"
          >
            Sign in with Google
          </button>

          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              If the button doesn&apos;t work, try this direct link:
            </p>
            <Link
              href="/api/auth/signin/google?callbackUrl=/"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Direct Google Sign-In Link
            </Link>
          </div>
        </div>
      )}

      {status === "authenticated" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p>Signed in as {session.user.email}</p>
            <button
              onClick={() => signOut()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm"
            >
              Sign out
            </button>
          </div>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-bold text-blue-800 mb-2">
              Paste the following prompt to ChatGPT or your AI of choice to
              generate a form structure:
            </h3>
            <p className="mb-3 text-sm">
              Copy this prompt to ChatGPT to generate a form structure:
            </p>
            <div className="relative">
              <pre
                ref={promptRef}
                className="bg-gray-800 text-white p-4 rounded text-sm overflow-auto max-h-60"
              >
                {gptPrompt}
              </pre>
              <button
                onClick={copyPromptToClipboard}
                className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
              >
                {promptCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="formName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Form Name
              </label>
              <input
                id="formName"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form name"
              />
            </div>

            <div>
              <label
                htmlFor="jsonData"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                JSON Data
              </label>
              <textarea
                id="jsonData"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                required
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Paste your JSON here"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setJsonData(sampleJson)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Load Sample JSON
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Form..." : "Create Google Form"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h3 className="font-bold mb-2">Error Creating Form</h3>
              <p>{error}</p>
              <div className="mt-3 text-sm">
                <p className="font-semibold">Common solutions:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Check that your JSON is properly formatted</li>
                  <li>
                    Ensure all required fields are included for each question
                  </li>
                  <li>
                    Verify your Google account has permission to create forms
                  </li>
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
      )}
    </div>
  );
}
