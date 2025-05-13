import Head from "next/head";
import AuthedNav from "./AuthedNav";

export default function DashboardLayout({ children, title, description }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-pink-800 text-white font-sans overflow-x-hidden">
      <Head>
        <title>{title ? `${title} | Prompt2Doc` : "Prompt2Doc"}</title>
        <meta
          name="description"
          content={description || "Create documents with AI"}
        />
      </Head>

      <AuthedNav />

      <main className="max-w-7xl mx-auto px-8 py-8 mt-[80px]">{children}</main>
    </div>
  );
}
