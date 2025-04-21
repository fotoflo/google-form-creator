import Head from "next/head";
import { useSession } from "next-auth/react";
import TopNav from "../components/TopNav";
export default function Sheets() {
  const { data: session, status } = useSession();

  return (
    <div>
      <TopNav />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Head>
          <title>Google Sheets Creator</title>
          <meta
            name="description"
            content="Create Google Sheets from templates"
          />
        </Head>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Google Sheets Creator
        </h1>

        {status === "loading" && (
          <div className="text-center py-4">Loading...</div>
        )}

        {status === "unauthenticated" && (
          <div className="text-center py-8">
            <p className="mb-4">Please sign in with Google to create sheets</p>
          </div>
        )}

        {session && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-center text-gray-600">
              Google Sheets Creator is coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
