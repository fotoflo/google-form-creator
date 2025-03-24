import Head from "next/head";
import { useSession } from "next-auth/react";

export default function Docs() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Head>
        <title>Google Docs Creator</title>
        <meta name="description" content="Create Google Docs from templates" />
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Google Docs Creator
      </h1>

      {status === "loading" && (
        <div className="text-center py-4">Loading...</div>
      )}

      {status === "unauthenticated" && (
        <div className="text-center py-8">
          <p className="mb-4">Please sign in with Google to create docs</p>
        </div>
      )}

      {session && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600">
            Google Docs Creator is coming soon!
          </p>
        </div>
      )}
    </div>
  );
}
