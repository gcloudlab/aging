import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { getProviders, useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { LoadingDots } from "@/components/icons";
import Avatar from "@/components/avatar";
import GitHubIcon from "../../components/icons/github";

export default function Sign() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  return (
    <Layout>
      <motion.div
        className="z-10 "
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {status !== "loading" &&
          (session?.user ? (
            <div className="text-center">
              <Avatar />
              <div className="w-42 mt-3">
                {session?.user && (
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className={`w-42 h-10 rounded-md border bg-white px-2 py-1 text-sm text-black transition-all hover:bg-black hover:text-white`}
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              disabled={loading}
              onClick={() => {
                setLoading(true);
                signIn("github", { callbackUrl: `/` });
              }}
              className={`${
                loading
                  ? "border-gray-300 bg-gray-200"
                  : "border-black bg-black hover:bg-gray-100"
              } w-42 h-10 rounded-md border px-2 py-1 text-sm text-white transition-all hover:text-black`}
            >
              {loading ? (
                <LoadingDots color="gray" />
              ) : (
                <div className="flex items-center justify-center">
                  <GitHubIcon className="mr-2 h-5" /> Sign in with GitHub
                </div>
              )}
            </button>
          ))}
      </motion.div>
    </Layout>
  );
}
