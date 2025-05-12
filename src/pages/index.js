import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import TopNav from "../components/TopNav";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-600 text-white font-sans overflow-x-hidden relative">
      {/* Animated Blobs Container to prevent overflow */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-0 right-[-15%] w-80 h-80 bg-purple-500 rounded-full filter blur-2xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] w-72 h-72 bg-blue-500 rounded-full filter blur-2xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <Head>
        <title>Prompt2Doc - Turn AI Chats into Polished Documents</title>
        <meta
          name="description"
          content="Transform your AI chat conversations into beautifully formatted Google Docs, Slides, Forms, and Sheets instantly."
        />
      </Head>

      <TopNav />

      {/* Hero with Split Layout */}
      <section className="relative z-10 mt-48 flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-8 mb-16 text-white">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight text-white">
            Turn AI Chats into
            <br />
            <span className="text-pink-300">Polished Documents</span>
          </h2>
          <p className="text-lg text-white font-medium">
            No more manual formatting. Copy, paste, and watch your ideas
            transform into Google Docs, Slides, Sheets or Forms—instantly.
          </p>
          <button
            onClick={() => signIn("google")}
            className="inline-block mt-4 px-6 py-3 bg-pink-400 text-white font-semibold rounded-full shadow-lg hover:bg-pink-300"
          >
            Try It Free
          </button>
        </div>
        <div className="md:w-1/2 mb-12 md:mb-0 flex justify-center">
          <Image
            src="/ai-doc-magic.png"
            alt="AI Document Magic"
            className="w-full max-w-lg md:max-w-lg rotate-6 drop-shadow-lg rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/320x320?text=AI+Doc+Magic";
            }}
            width={502}
            height={344}
          />
        </div>
      </section>

      {/* Features Showcase Carousel */}
      <section id="features" className="relative z-10 py-20 mb-16 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-4xl font-bold text-center mb-12 text-white">
            Why Prompt2Doc?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition text-white">
              <h4 className="text-2xl font-semibold mb-2 text-white">
                ⚡ Lightning Fast
              </h4>
              <p className="font-medium text-white">
                Format entire drafts in seconds, not hours.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition text-white">
              <h4 className="text-2xl font-semibold mb-2 text-white">
                🎨 Customizable
              </h4>
              <p className="font-medium text-white">
                Choose templates for corporate, creative, or academic styles.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition text-white">
              <h4 className="text-2xl font-semibold mb-2 text-white">
                🌐 Anywhere Access
              </h4>
              <p className="font-medium text-white">
                Works with Claude, ChatGPT, Llama, and more—no vendor lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Case Split */}
      <section
        id="use-case"
        className="relative z-10 py-20 max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12 mb-16 text-white"
      >
        <div className="md:w-1/2">
          <Image
            src="/doc-types.png"
            alt="Team Working"
            className="rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x300?text=Team+Working";
            }}
            width={502}
            height={344}
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-3xl font-bold text-white">
            Perfect for Every Workflow
          </h3>
          <ul className="list-disc list-inside space-y-2 text-white font-medium">
            <li>Startup pitch decks without the sweat</li>
            <li>Academic papers auto-formatted to style guides</li>
            <li>Training manuals in minutes</li>
            <li>Client proposals that impress</li>
          </ul>
        </div>
      </section>

      {/* CTA & Prompt Block */}
      <section
        id="get-started"
        className="relative z-10 py-20 text-center max-w-7xl mx-auto px-8 mb-16 text-white"
      >
        <h3 className="text-3xl font-bold mb-6 text-white">
          Get Started in 3 Steps
        </h3>
        <div className="flex flex-col md:flex-row justify-center gap-12 mb-12 text-white">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <p className="text-white font-medium">Chat with your favorite AI</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <p className="text-white font-medium">Use our magic prompt</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <p className="text-white font-medium">Paste & create instantly</p>
          </div>
        </div>
        <div className="inline-block text-left mx-auto max-w-2xl w-full">
          <textarea
            readOnly
            className="w-full p-4 rounded-lg bg-white bg-opacity-10 text-gray-900 text-sm font-mono caret-transparent border border-white/20 placeholder-white resize-none"
            value={
              "Please structure the following content for a [Google Doc/Presentation/Form/Sheet]: [Paste here]. Format it for Prompt2Doc conversion—sections, headings, lists, and styles included."
            }
          />
          <button
            className="mt-4 bg-pink-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-300 shadow-lg"
            onClick={() => {
              navigator.clipboard.writeText(
                "Please structure the following content for a [Google Doc/Presentation/Form/Sheet]: [Paste here]. Format it for Prompt2Doc conversion—sections, headings, lists, and styles included."
              );
            }}
          >
            Copy Prompt
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-gray-300">
        <p>&copy; {new Date().getFullYear()} Prompt2Doc. Crafted with 💜</p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-white font-semibold">
            Privacy
          </a>
          <a href="#" className="hover:text-white font-semibold">
            Terms
          </a>
          <a href="#" className="hover:text-white font-semibold">
            Support
          </a>
        </div>
      </footer>

      {/* Blob Animation CSS */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
