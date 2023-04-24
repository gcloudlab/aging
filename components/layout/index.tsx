import { ReactNode, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import Meta, { defaultMetaProps } from "./meta";
import { Github } from "../shared/icons";
import { LoadingDots } from "@/components/icons";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Meta props={defaultMetaProps} />
      <div className="fixed h-screen w-full bg-gradient-to-br from-emerald-200 via-blue-100 to-rose-200" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <svg
              width="25"
              height="25"
              viewBox="0 0 1155 1000"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 rounded-sm"
            >
              <path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill="black" />
            </svg>
            <p>Aging</p>
          </Link>
          <div className="flex items-center space-x-4">
            {status !== "loading" &&
              (session?.user ? (
                <Link href={`/${session.username}`}>
                  <a className="h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={
                        session.user.image ||
                        `https://avatar.tobi.sh/${session.user.name}`
                      }
                      alt={session.user.name || "User"}
                      width={300}
                      height={300}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                    />
                  </a>
                </Link>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    signIn("github", { callbackUrl: `/profile` });
                  }}
                  className={`${
                    loading
                      ? "border-gray-300 bg-gray-200"
                      : "border-black bg-black hover:bg-white"
                  } h-8 w-36 rounded-md border py-1 text-sm text-white transition-all hover:text-black`}
                >
                  {loading ? (
                    <LoadingDots color="gray" />
                  ) : (
                    "Log in with GitHub"
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>

      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>

      <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
        <p className="flex justify-center text-gray-500">
          <a
            className=" font-semibold text-gray-600 transition-colors hover:text-black"
            href="https://github.com/gcloudlab/aging"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
          </a>
        </p>
      </div>
    </>
  );
}
