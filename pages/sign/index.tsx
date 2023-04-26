import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { useState } from "react";
import GithubButton from "@/components/button/github-sign-button";

// TODO: Redirect when signd
export default function Sign() {
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
        <GithubButton />
      </motion.div>
    </Layout>
  );
}
