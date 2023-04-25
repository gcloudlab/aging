import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { LoadingDots } from "@/components/icons";
import Avatar from "@/components/avatar";

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
            <Avatar />
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
              {loading ? <LoadingDots color="gray" /> : "Sign in with GitHub"}
            </button>
          ))}
      </motion.div>
    </Layout>
  );
}
