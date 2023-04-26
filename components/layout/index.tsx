import { ReactNode, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import Meta, { MetaProps, defaultMetaProps } from "./meta";
import Footer from "./footer";
import Avatar from "../avatar";
import Logo from "../logo";

export default function Layout({
  meta,
  children,
}: {
  meta?: MetaProps;
  children: ReactNode;
}) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();

  return (
    <>
      <Meta props={{ ...defaultMetaProps, ...meta }} />
      <div className="fixed h-screen w-full bg-gradient-to-br from-emerald-200 via-blue-100 to-rose-200" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Logo />
          <div className="flex items-center space-x-4">
            {session?.user ? <Avatar /> : <Link href={"/sign"}>登录</Link>}
          </div>
        </div>
      </div>

      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>

      <Footer />
    </>
  );
}
