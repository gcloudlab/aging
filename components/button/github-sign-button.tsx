import { useState } from "react";
import { signIn } from "next-auth/react";
import { GitHubIcon, LoadingDots } from "@/components/icons";

export default function GithubButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn("github", { callbackUrl: `/` });
      }}
      className={`${className} ${
        loading
          ? "border-gray-300 bg-gray-200"
          : "border-black bg-black hover:bg-gray-100"
      } h-10 rounded-md border px-2 py-1 text-sm text-white transition-all hover:text-black`}
    >
      {loading ? (
        <LoadingDots color="gray" />
      ) : (
        <div className="flex items-center justify-center">
          <GitHubIcon className="mr-2 h-5" /> 使用 GitHub 登录
        </div>
      )}
    </button>
  );
}
