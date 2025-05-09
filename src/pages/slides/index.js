import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../../components/TopNav";
import { FiArrowRight, FiLayout } from "react-icons/fi";

export default function SlidesOverview() {
  const router = useRouter();

  const examples = [
    {
      title: "Project Kickoff",
      description:
        "Professional presentation template for project kickoff meetings",
      prompt:
        "Create a project kickoff presentation with sections for goals, timeline, and team roles",
    },
    {
      title: "Product Launch",
      description: "Engaging slides for launching new products or features",
      prompt:
        "Design a product launch presentation highlighting key features and benefits",
    },
    {
      title: "Team Retrospective",
      description: "Structured format for team retrospectives and reviews",
      prompt:
        "Create a retrospective presentation template with sections for wins, challenges, and action items",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Google Slides Creator | AI Document Creator</title>
        <meta
          name="description"
          content="Create professional Google Slides presentations with AI"
        />
      </Head>

      <TopNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Professional Presentations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Turn your ideas into polished Google Slides presentations with AI
            assistance. Choose a template or start from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 mr-4">
                  <FiLayout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {example.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{example.description}</p>
              <button
                onClick={() =>
                  router.push(
                    `/slides/create?prompt=${encodeURIComponent(
                      example.prompt
                    )}`
                  )
                }
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                Use Template <FiArrowRight className="ml-2" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/slides/create")}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
          >
            Create New Presentation
          </button>
        </div>
      </main>
    </div>
  );
}
