import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import { Github } from "../shared/icons";

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

  return (
    <>
      <Meta {...meta} />
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
            <Link href="/sign">登陆</Link>
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-cyan-200 to-[#41c6b0]"></div>
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
