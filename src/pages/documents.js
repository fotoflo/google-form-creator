import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../components/TopNav";
import { SkeletonForm } from "../components/Skeleton";

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

    if (!session) {
      router.push("/");
      return;
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>Create Document | Prompt2Doc</title>
        <meta name="description" content="Create Google Docs with Prompt2Doc" />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white">
          Create a Document with Prompt2Doc
        </h1>

        {status === "loading" ? (
          <SkeletonForm />
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
                {error}
              </div>
            )}

            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-6 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-white font-medium mb-2"
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
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[rgba(0,0,0,0.2)] text-white placeholder-gray-300 border-gray-600"
                    placeholder="Enter a title for your document"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block text-white font-medium mb-2"
                  >
                    Document Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={documentData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[rgba(0,0,0,0.2)] text-white border-gray-600"
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
                    className="block text-white font-medium mb-2"
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
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[rgba(0,0,0,0.2)] text-white placeholder-gray-300 border-gray-600"
                    placeholder="Describe the document you want Prompt2Doc to create. For example: 'A research report on renewable energy sources, focusing on solar and wind power, their current adoption rates, and future potential.'"
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Creating Document..." : "Create Document"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>

      <footer className="py-6 text-center text-gray-300 text-sm">
        <p>© {new Date().getFullYear()} Prompt2Doc</p>
      </footer>
    </div>
  );
}
