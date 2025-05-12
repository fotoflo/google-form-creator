import { useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiLogOut, FiUser, FiSettings } from "react-icons/fi";

export default function AuthedNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="bg-transparent absolute top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <div className="relative w-[241px] h-[64px]">
            <Image
              src="/prompt2doc-logo.png"
              alt="Prompt2Doc logo"
              fill
              sizes="(max-width: 768px) 150px, 241px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center space-x-8">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">📝</span>Docs
          </Link>
          <Link
            href="/dashboard/sheets"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">📊</span>Sheets
          </Link>
          <Link
            href="/dashboard/slides"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">🖼️</span>Slides
          </Link>
          <Link
            href="/dashboard/forms"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">📋</span>Forms
          </Link>
          <Link
            href="/dashboard/prompts"
            className="inline-flex items-center text-white hover:text-pink-200 font-semibold"
          >
            <span className="mr-2">💡</span>Prompts
          </Link>

          {/* Profile dropdown */}
          <div className="relative ml-4">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 text-white hover:text-pink-200 focus:outline-none"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-semibold">
                {session?.user?.name || "Profile"}
              </span>
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${
                  isProfileMenuOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[rgba(0,0,0,0.7)] backdrop-blur-md rounded-md shadow-xl z-50 border border-[rgba(255,255,255,0.1)]">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-pink-200"
                >
                  <FiUser className="mr-2" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-pink-200"
                >
                  <FiSettings className="mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-pink-200"
                >
                  <FiLogOut className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav toggle */}
        <div className="-mr-2 flex items-center sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[rgba(255,255,255,0.1)] focus:outline-none"
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
        } sm:hidden bg-[rgba(0,0,0,0.8)] backdrop-blur-md`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            href="/dashboard/documents"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-pink-300"
          >
            <span className="mr-2">📝</span>Docs
          </Link>
          <Link
            href="/dashboard/sheets"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-pink-300"
          >
            <span className="mr-2">📊</span>Sheets
          </Link>
          <Link
            href="/dashboard/slides"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-pink-300"
          >
            <span className="mr-2">🖼️</span>Slides
          </Link>
          <Link
            href="/dashboard/forms"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-pink-300"
          >
            <span className="mr-2">📋</span>Forms
          </Link>
          <Link
            href="/dashboard/prompts"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-pink-300"
          >
            <span className="mr-2">💡</span>Prompts
          </Link>
          <div className="flex flex-col mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <span className="text-base font-medium text-white">
              {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="mt-2 text-sm text-pink-200 hover:text-pink-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
