import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../components/TopNav";
import ReactMarkdown from "react-markdown";

export default function Result() {
  const router = useRouter();
  const { id } = router.query;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        // Determine which endpoint to call based on the result type
        // This would need to be enhanced if you don't store the type with the result
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

  const renderContent = () => {
    if (!result) return null;

    try {
      // For markdown slides
      if (result.type === "slides-markdown") {
        // Split the markdown content by slide separator
        const slides = result.content
          .split(/\n\s*---\s*\n/)
          .map((slide, index) => ({
            id: index + 1,
            content: slide.trim(),
          }));

        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">{result.title}</h2>

            <div className="space-y-8">
              {slides.map((slide) => (
                <div key={slide.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  navigator.clipboard.writeText(result.content);
                  alert("Markdown copied to clipboard!");
                }}
              >
                Copy Markdown
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  /* Add export functionality */
                }}
              >
                Export to Google Slides
              </button>
            </div>
          </div>
        );
      }

      // Handle JSON slides format for backward compatibility
      if (result.type === "slides") {
        const slidesData = JSON.parse(result.content);

        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">{slidesData.title}</h2>

            <div className="space-y-8">
              {slidesData.slides.map((slide) => (
                <div key={slide.slideNumber} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Slide {slide.slideNumber}
                    </span>
                    <span className="text-sm text-gray-500">
                      {slide.slideType}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{slide.title}</h3>
                  <ul className="list-disc pl-5 mb-3">
                    {slide.content.map((item, index) => (
                      <li key={index} className="mb-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {slide.notes && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                      <strong>Notes:</strong> {slide.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  /* Add export functionality */
                }}
              >
                Export to Google Slides
              </button>
            </div>
          </div>
        );
      }

      // Handle other result types as needed
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{result.title}</h2>
          <pre className="whitespace-pre-wrap">{result.content}</pre>
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Result | AI Document Creator</title>
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Generated Content
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <p>Loading your content...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
        ) : (
          renderContent()
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Create Another
          </button>
        </div>
      </main>
    </div>
  );
}
