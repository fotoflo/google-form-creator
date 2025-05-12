import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../components/TopNav";
import ReactMarkdown from "react-markdown";
import {
  FiExternalLink,
  FiCopy,
  FiArrowLeft,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";

export default function Result() {
  const router = useRouter();
  const { id } = router.query;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/getResult?id=${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch result");
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error("Error fetching result:", err);
        setError("Failed to load the result. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!result || !result.presentationId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this presentation? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/deleteResult?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the presentation");
      }

      router.push("/");
    } catch (err) {
      console.error("Error deleting presentation:", err);
      setDeleteError("Failed to delete the presentation. Please try again.");
      setDeleting(false);
    }
  };

  const renderGoogleSlides = () => {
    if (!result || !result.presentationId) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{result.title}</h2>

          <div className="mb-6">
            <div className="rounded-lg overflow-hidden border border-gray-200 h-[600px]">
              <iframe
                src={`https://docs.google.com/presentation/d/${result.presentationId}/embed?start=false&loop=false&delayms=3000`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://docs.google.com/presentation/d/${result.presentationId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiExternalLink /> Open in Google Slides
            </a>

            <a
              href={`https://docs.google.com/presentation/d/${result.presentationId}/present`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiExternalLink /> Start Presentation
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Presentation Details</h3>
          {deleteError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {deleteError}
            </div>
          )}
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Created:</strong>{" "}
              {new Date(result.timestamp).toLocaleString()}
            </p>
            <div className="flex items-center">
              <p className="flex items-center">
                <strong>ID:</strong>{" "}
                <a
                  href={`https://docs.google.com/presentation/d/${result.presentationId}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {result.presentationId}
                </a>
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`ml-2 p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors ${
                  deleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Delete presentation"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoogleForm = () => {
    if (!result || !result.formUrl) return null;

    // Extract form ID from URL
    const formId = result.formUrl.match(/\/forms\/d\/([^/]+)/)?.[1];

    if (!formId) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {result.title || "Google Form"}
          </h2>

          <div className="mb-6">
            <div className="rounded-lg overflow-hidden border border-gray-200 h-[800px]">
              <iframe
                src={`https://docs.google.com/forms/d/${formId}/viewform?embedded=true`}
                frameBorder="0"
                className="w-full h-full"
              >
                Loading form...
              </iframe>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={result.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiExternalLink /> Open Form
            </a>

            <a
              href={`https://docs.google.com/forms/d/${formId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiExternalLink /> Edit Form
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderMarkdownSlides = () => {
    if (!result || !result.content) return null;

    // Split the markdown content by slide separator
    const slides = result.content
      .split(/\n\s*===SLIDE===\s*\n/)
      .map((slide, index) => ({
        id: index + 1,
        content: slide.trim(),
      }));

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{result.title}</h2>
            <button
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleCopyToClipboard(result.content)}
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
          </div>

          <div className="space-y-8">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="border border-gray-200 p-5 rounded-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                    Slide {slide.id}
                  </span>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{slide.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() =>
                router.push(
                  `/slides?markdown=${encodeURIComponent(
                    result.content
                  )}&title=${encodeURIComponent(result.title || "")}`
                )
              }
            >
              Export to Google Slides
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!result) return null;

    try {
      // Google Slides
      if (result.type === "google-slides") {
        return renderGoogleSlides();
      }

      // Google Forms
      if (result.type === "google-form") {
        return renderGoogleForm();
      }

      // Markdown slides
      if (result.type === "slides-markdown") {
        return renderMarkdownSlides();
      }

      // JSON slides format (backward compatibility)
      if (result.type === "slides") {
        try {
          const slidesData = JSON.parse(result.content);

          return (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{slidesData.title}</h2>
                <button
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleCopyToClipboard(result.content)}
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>

              <div className="space-y-6">
                {slidesData.slides.map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="border border-gray-200 p-5 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                        Slide {slide.slideNumber}
                      </span>
                      <span className="text-sm text-gray-500">
                        {slide.slideType}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {slide.title}
                    </h3>
                    <ul className="list-disc pl-5 mb-3 space-y-1">
                      {slide.content.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    {slide.notes && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-sm font-medium text-amber-800">
                          Speaker Notes:
                        </p>
                        <p className="text-sm text-amber-700">{slide.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => {
                    // Convert to markdown and redirect to slides page
                    const markdown = slidesData.slides
                      .map((slide) => {
                        let md = `# ${slide.title}\n\n`;
                        md += slide.content
                          .map((item) => `- ${item}`)
                          .join("\n");
                        if (slide.notes) {
                          md += `\n\n>>> SPEAKER NOTES >>>\n${slide.notes}\n<<< SPEAKER NOTES <<<`;
                        }
                        return md;
                      })
                      .join("\n\n===SLIDE===\n\n");

                    router.push(
                      `/slides?markdown=${encodeURIComponent(
                        markdown
                      )}&title=${encodeURIComponent(slidesData.title || "")}`
                    );
                  }}
                >
                  Export to Google Slides
                </button>
              </div>
            </div>
          );
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          return (
            <div className="bg-red-100 p-4 rounded-md text-red-700">
              Error parsing slide content. The JSON format may be invalid.
            </div>
          );
        }
      }

      // Generic content fallback
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {result.title || "Generated Content"}
          </h2>
          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm">{result.content}</pre>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={() => handleCopyToClipboard(result.content)}
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? "Copied!" : "Copy Content"}
            </button>
          </div>
        </div>
      );
    } catch (err) {
      console.error("Error rendering content:", err);
      return (
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Error displaying content. The format may be invalid.
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>{result?.title || "Result"} | AI Document Creator</title>
        <meta name="description" content="View your generated document" />
      </Head>

      <TopNav />

      <main className="max-w-5xl mx-auto py-10 px-4 mt-20">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-pink-200"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-white/80">Loading your content...</p>
          </div>
        ) : error ? (
          <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg text-white shadow-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Return Home
            </button>
          </div>
        ) : (
          renderContent()
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Something New
          </button>
        </div>
      </main>

      <footer className="py-6 text-center text-white/60 text-sm">
        <p>© {new Date().getFullYear()} AI Document Creator</p>
      </footer>
    </div>
  );
}
