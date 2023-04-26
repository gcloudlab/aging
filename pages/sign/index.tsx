import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { useState } from "react";
import GithubButton from "@/components/button/github-sign-button";
import EmailButton from "@/components/button/email-sign-butto";

// TODO: Redirect when signd
export default function Sign() {
  const [email, setEmail] = useState("");

  return (
    <Layout meta={{ title: "登录 | Oh my life" }}>
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
        <div className="flex flex-col text-center">
          <input
            className="mb-2 w-56 rounded-md"
            type="text"
            placeholder="输入邮箱"
            onChange={(e) => setEmail(e.target.value)}
          />
          <EmailButton email={email} />
          <span className="my-2 text-sm">或</span>
          <GithubButton />
        </div>
      </motion.div>
    </Layout>
  );
}
