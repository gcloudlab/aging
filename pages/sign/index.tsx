import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { LoadingDots } from "@/components/icons";
import GitHubIcon from "../../components/icons/github";

// TODO: Redirect when signd
export default function Sign() {
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
          } h-10 w-48 rounded-md border px-2 py-1 text-sm text-white transition-all hover:text-black`}
        >
          {loading ? (
            <LoadingDots color="gray" />
          ) : (
            <div className="flex items-center justify-center">
              <GitHubIcon className="mr-2 h-5" /> Sign in with GitHub
            </div>
          )}
        </button>
      </motion.div>
    </Layout>
  );
}
