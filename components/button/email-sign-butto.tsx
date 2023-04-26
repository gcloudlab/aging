import { useState } from "react";
import { signIn } from "next-auth/react";
import { LoadingDots } from "@/components/icons";

export default function EmailButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn("email", { callbackUrl: `/` });
      }}
      className={`${
        loading
          ? "border-gray-300 bg-gray-200"
          : "border-black bg-black hover:bg-gray-100"
      } h-10 w-48 rounded-md border px-2 py-1 text-sm text-white transition-all hover:text-black`}
    >
      {loading ? (
        <LoadingDots color="gray" />
      ) : (
        <div className="flex items-center justify-center">使用邮箱账号登录</div>
      )}
    </button>
  );
}
