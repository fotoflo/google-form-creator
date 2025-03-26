import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SignIn({ providers }) {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head>
        <title>Sign In - Google Forms Creator</title>
      </Head>

      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Google Forms Creator
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your Google account to create forms
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <h3 className="font-bold mb-2">Authentication Error</h3>
            <p>
              {error === "google"
                ? "There was a problem signing in with Google. Please make sure you have allowed the necessary permissions."
                : "An error occurred during sign in. Please try again."}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="text-center">
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
