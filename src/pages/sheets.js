import Head from "next/head";
import { useSession } from "next-auth/react";
import TopNav from "../components/TopNav";
import { SkeletonForm } from "../components/Skeleton";

export default function Sheets() {
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>Google Sheets Creator</title>
        <meta
          name="description"
          content="Create Google Sheets from templates"
        />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Google Sheets Creator
        </h1>

        {status === "loading" ? (
          <SkeletonForm />
        ) : status === "unauthenticated" ? (
          <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg shadow-md">
            <p className="text-center text-white mb-4">
              Please sign in with Google to create sheets
            </p>
          </div>
        ) : (
          <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg shadow-md">
            <p className="text-center text-white">
              Google Sheets Creator is coming soon!
            </p>
            <p className="text-center text-white/70 mt-2 text-sm">
              We&apos;re working hard to bring you powerful spreadsheet creation
              capabilities.
            </p>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-gray-300 text-sm">
        <p>© {new Date().getFullYear()} AI Document Creator</p>
      </footer>
    </div>
  );
}
