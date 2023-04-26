import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Layout from "@/components/layout";
import { MetaProps, defaultMetaProps } from "@/components/layout/meta";
import { getUser, getAllUsers, getUserCount, UserProps } from "@/lib/api/user";
// export { default } from ".";
import clientPromise from "@/lib/mongodb";
import { useState } from "react";
import Avatar from "@/components/avatar";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Balancer from "react-wrap-balancer";
import GithubButton from "@/components/button/github-sign-button";
import SignOutButton from "@/components/button/sign-out-button";
import EmailButton from "@/components/button/email-sign-butto";

interface Params extends ParsedUrlQuery {
  username: string;
}

export default function Username({
  meta,
  user,
}: {
  meta: MetaProps;
  user: UserProps;
}) {
  // console.log("[username]", user);
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
            <motion.div className="flex flex-col items-center justify-center">
              <Avatar size={20} />
              {/* <motion.h3
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>Hi, {session?.user.name}</Balancer>
              </motion.h3> */}
              <motion.div className="mt-3 w-48">
                {session?.user && <SignOutButton />}
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col">
              <EmailButton />
              <GithubButton className="mt-2" />
            </div>
          ))}
      </motion.div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  // You should remove this try-catch block once your MongoDB Cluster is fully provisioned
  try {
    await clientPromise;
  } catch (e: any) {
    // cluster is still provisioning
    return {
      paths: [],
      fallback: true,
    };
  }

  const results = await getAllUsers();
  const paths = results.flatMap(({ users }) =>
    users.map((user) => ({ params: { username: user.username } })),
  );
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  // You should remove this try-catch block once your MongoDB Cluster is fully provisioned
  // try {
  //   await clientPromise;
  // } catch (e: any) {
  //   if (e.code === "ENOTFOUND") {
  //     // cluster is still provisioning
  //     return {
  //       props: {
  //         clusterStillProvisioning: true,
  //       },
  //     };
  //   } else {
  //     throw new Error(`Connection limit reached. Please try again later.`);
  //   }
  // }

  const { username } = context.params as Params;
  const user = await getUser(username);
  console.log("[User]", user?.name);
  if (!user) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  const results = await getAllUsers();
  const totalUsers = await getUserCount();

  const ogUrl = `https://ai.aging.run/${user.username}`;
  const meta = {
    ...defaultMetaProps,
    title: `${user.name} | Oh my life`,
    ogImage: `https://api.microlink.io/?url=${ogUrl}&screenshot=true&meta=false&embed=screenshot.url`,
    ogUrl: `https://ai.aging.run/${user.username}`,
  };

  return {
    props: {
      meta,
      results,
      totalUsers,
      user,
    },
    revalidate: 10,
  };
};
