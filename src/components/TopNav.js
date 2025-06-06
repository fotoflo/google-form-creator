import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const navItems = [
    { href: "/#features", label: "Features" },
    { href: "/#use-case", label: "Use Cases" },
  ];

  // Use landing nav style if not authenticated and on home page
  const isLanding = !session && router.pathname === "/";

  return (
    <nav className="bg-transparent absolute top-0 left-0 w-full z-20 ">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href={session ? "/dashboard" : "/"} className="flex items-center">
          <Image
            src="/prompt2doc-logo.png"
            alt="Prompt2Doc logo"
            width={200}
            height={48}
            priority
            className="h-16 w-auto"
            style={{ minWidth: 40 }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center space-x-8">
          <Link
            href="/documents"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">📝</span>Docs
          </Link>
          <Link
            href="/sheets"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">📊</span>Sheets
          </Link>
          <Link
            href="/slides"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">🖼️</span>Slides
          </Link>
          <Link
            href="/forms"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">📋</span>Forms
          </Link>
          <Link
            href="/prompts"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">💡</span>Prompts
          </Link>
          {session ? (
            <div className="flex items-center space-x-4 ml-4">
              <span className="text-sm text-white font-semibold">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-white hover:text-pink-200 font-semibold"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-colors ml-2"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile nav toggle */}
        <div className="-mr-2 flex items-center sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:text-purple-700 focus:outline-none"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:hidden bg-black bg-opacity-80`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          {isLanding ? (
            <>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-white text-lg font-medium py-2 hover:underline"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => signIn("google")}
                className="w-full px-4 py-2 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-colors mt-2"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <Link
                href="/documents"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-white hover:bg-white hover:bg-opacity-10 hover:border-pink-200"
              >
                <span className="mr-2">📝</span>Docs
              </Link>
              <Link
                href="/sheets"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-white hover:bg-white hover:bg-opacity-10 hover:border-pink-200"
              >
                <span className="mr-2">📊</span>Sheets
              </Link>
              <Link
                href="/slides"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-white hover:bg-white hover:bg-opacity-10 hover:border-pink-200"
              >
                <span className="mr-2">🖼️</span>Slides
              </Link>
              <Link
                href="/forms"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-white hover:bg-white hover:bg-opacity-10 hover:border-pink-200"
              >
                <span className="mr-2">📋</span>Forms
              </Link>
              <Link
                href="/prompts"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-white hover:bg-white hover:bg-opacity-10 hover:border-pink-200"
              >
                <span className="mr-2">💡</span>Prompts
              </Link>
              {session ? (
                <div className="flex flex-col mt-2">
                  <span className="text-base font-medium text-white">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-1 text-sm text-white hover:text-pink-200"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="w-full px-4 py-2 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-colors mt-2"
                >
                  Sign in to Get Started
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
