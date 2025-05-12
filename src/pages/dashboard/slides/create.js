import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CreateSlides() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Create Presentation"
      description="Create a new Google Slides presentation with AI assistance"
    >
      <h1 className="text-3xl font-bold text-white mb-4">
        Create a New Presentation
      </h1>

      {/* Rest of your slides creation page content */}
    </DashboardLayout>
  );
}
