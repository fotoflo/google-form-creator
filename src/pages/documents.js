import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../components/TopNav";

export default function Documents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documentData, setDocumentData] = useState({
    title: "",
    type: "report", // Default document type
    prompt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create document");
      }

      // Redirect to the result page
      router.push(`/result?id=${data.resultId}`);
    } catch (err) {
      console.error("Error creating document:", err);
      setError(err.message || "An error occurred while creating the document");
      setLoading(false);
    }
  };

  // If loading session, show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to home
  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create Document | Prompt2Doc</title>
        <meta name="description" content="Create Google Docs with Prompt2Doc" />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create a Document with Prompt2Doc
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Document Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={documentData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter a title for your document"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-gray-700 font-medium mb-2"
              >
                Document Type
              </label>
              <select
                id="type"
                name="type"
                value={documentData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="report">Report</option>
                <option value="essay">Essay</option>
                <option value="letter">Letter</option>
                <option value="article">Article</option>
                <option value="proposal">Proposal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="prompt"
                className="block text-gray-700 font-medium mb-2"
              >
                What would you like to write about?
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={documentData.prompt}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe the document you want Prompt2Doc to create. For example: 'A research report on renewable energy sources, focusing on solar and wind power, their current adoption rates, and future potential.'"
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating Document..." : "Create Document"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Prompt2Doc</p>
      </footer>
    </div>
  );
}
