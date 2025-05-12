import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import AuthedNav from "../../../components/AuthedNav";

export default function Documents() {
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
      <div className="min-h-screen bg-gray-900">
        <AuthedNav />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Create Document | Prompt2Doc</title>
        <meta
          name="description"
          content="Create a new Google Doc with AI assistance"
        />
      </Head>

      <AuthedNav />

      <main className="max-w-6xl mx-auto px-4 mt-20">
        <h1 className="text-3xl font-bold text-white mb-4">
          Create a New Document
        </h1>
        {/* Rest of your documents page content */}
      </main>
    </div>
  );
}
