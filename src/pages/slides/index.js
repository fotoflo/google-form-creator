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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>Google Slides Creator | Prompt2Doc</title>
        <meta
          name="description"
          content="Create professional Google Slides presentations with AI"
        />
      </Head>

      <TopNav />

      <main className="max-w-6xl mx-auto px-4 py-8 mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Professional Presentations
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Turn your ideas into polished Google Slides presentations with AI
            assistance. Choose a template or start from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-800 rounded-full flex items-center justify-center text-white mr-4">
                  <FiLayout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {example.title}
                </h3>
              </div>
              <p className="text-white/80 mb-4">{example.description}</p>
              <button
                onClick={() =>
                  router.push(
                    `/slides/create?prompt=${encodeURIComponent(
                      example.prompt
                    )}`
                  )
                }
                className="text-pink-200 hover:text-pink-100 flex items-center"
              >
                Use Template <FiArrowRight className="ml-2" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/slides/create")}
            className="px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg"
          >
            Create New Presentation
          </button>
        </div>
      </main>
    </div>
  );
}
