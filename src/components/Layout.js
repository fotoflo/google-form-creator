import React from "react";
import TopNav from "./TopNav";
import Head from "next/head";

export default function Layout({ children, title, description }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title || "AI Document Creator"}</title>
        <meta
          name="description"
          content={description || "Create documents with AI"}
        />
      </Head>

      <TopNav />

      <main className="max-w-4xl mx-auto py-10 px-4">{children}</main>
    </div>
  );
}
