import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../components/DashboardLayout";

export default function Sheets() {
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
      title="Create Sheet"
      description="Create a new Google Sheet with AI assistance"
    >
      <h1 className="text-3xl font-bold text-white mb-4">Create a New Sheet</h1>

      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Sheet Generator
        </h2>
        <p className="text-gray-300 mb-6">
          Transform your data into organized Google Sheets with AI assistance.
          Perfect for creating budgets, trackers, schedules, and data analysis.
        </p>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-white font-medium mb-2"
            >
              Sheet Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your sheet"
            />
          </div>

          <div>
            <label
              htmlFor="sheetType"
              className="block text-white font-medium mb-2"
            >
              Sheet Type
            </label>
            <select
              id="sheetType"
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="budget">Budget Tracker</option>
              <option value="schedule">Schedule/Calendar</option>
              <option value="inventory">Inventory Management</option>
              <option value="project">Project Tracker</option>
              <option value="custom">Custom Sheet</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-white font-medium mb-2"
            >
              Content/Data
            </label>
            <textarea
              id="content"
              rows="6"
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your data or describe what you'd like in your sheet..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Sheet
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
