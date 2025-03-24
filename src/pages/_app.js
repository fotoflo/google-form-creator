import { SessionProvider } from "next-auth/react";
import TopNav from "../components/TopNav";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <main className="flex-grow py-6 relative z-10">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}

export default MyApp;
