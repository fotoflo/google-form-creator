import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../components/DashboardLayout";

export default function Prompts() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="AI Prompts"
      description="Access helpful AI prompts for document creation"
    >
      <h1 className="text-3xl font-bold text-white mb-4">AI Prompts</h1>

      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Document Creation Prompts
        </h2>
        <div className="space-y-6">
          <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-md">
            <h3 className="text-xl font-medium text-white mb-2">
              Google Doc Prompt
            </h3>
            <div className="bg-gray-800 p-3 rounded text-gray-200 font-mono text-sm mb-2">
              Please structure the following content for a Google Doc: [Paste
              here]. Format it for Prompt2Doc conversion—sections, headings,
              lists, and styles included.
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(
                  "Please structure the following content for a Google Doc: [Paste here]. Format it for Prompt2Doc conversion—sections, headings, lists, and styles included."
                );
              }}
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-md">
            <h3 className="text-xl font-medium text-white mb-2">
              Google Slides Prompt
            </h3>
            <div className="bg-gray-800 p-3 rounded text-gray-200 font-mono text-sm mb-2">
              Please structure the following content for a Google Presentation:
              [Paste here]. Format it for Prompt2Doc conversion—slides, titles,
              bullet points, and speaker notes included.
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(
                  "Please structure the following content for a Google Presentation: [Paste here]. Format it for Prompt2Doc conversion—slides, titles, bullet points, and speaker notes included."
                );
              }}
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-md">
            <h3 className="text-xl font-medium text-white mb-2">
              Google Form Prompt
            </h3>
            <div className="bg-gray-800 p-3 rounded text-gray-200 font-mono text-sm mb-2">
              Please structure the following content for a Google Form: [Paste
              here]. Format it for Prompt2Doc conversion—questions, options,
              sections, and form logic included.
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(
                  "Please structure the following content for a Google Form: [Paste here]. Format it for Prompt2Doc conversion—questions, options, sections, and form logic included."
                );
              }}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
