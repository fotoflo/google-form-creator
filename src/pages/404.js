import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import TopNav from "../components/TopNav";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function Custom404() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleHomeClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 text-white font-sans overflow-x-hidden">
      <Head>
        <title>Page Not Found | Prompt2Doc</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist"
        />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto px-4 py-8 mt-20">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <p className="text-2xl text-white mb-4">Oops! Page not found</p>
          <p className="text-gray-200 mb-12 max-w-lg mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-sm text-white rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>
            <button
              onClick={handleHomeClick}
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              <FiHome className="mr-2" />
              {session ? "Return to Dashboard" : "Return Home"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
