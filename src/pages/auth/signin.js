import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function SignIn({ providers }) {
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

        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="text-center">
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-3"
                >
                  Sign in with {provider.name} (onClick)
                </button>

                <Link
                  href={`/api/auth/signin/${provider.id}?callbackUrl=/`}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign in with {provider.name} (direct link)
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers: providers ?? {} },
  };
}
