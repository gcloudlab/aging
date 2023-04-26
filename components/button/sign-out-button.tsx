import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => {
        signOut({
          callbackUrl: "/",
        });
      }}
      className={`h-10 w-48 rounded-md border bg-white px-2 py-1 text-sm text-black transition-all hover:bg-black hover:text-white`}
    >
      退出登陆
    </button>
  );
}
