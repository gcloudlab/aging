import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Layout from "@/components/layout";
import { MetaProps, defaultMetaProps } from "@/components/layout/meta";
import {
  getUser,
  getAllUsers,
  getUserCount,
  UserProps,
  getUserByEmail,
} from "@/lib/api/user";
// export { default } from ".";
import Avatar from "@/components/avatar";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import SignOutButton from "@/components/button/sign-out-button";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Balancer from "react-wrap-balancer";
import Link from "next/link";

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
  console.log("[Status]", status);

  return (
    <Layout meta={meta}>
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
        <motion.div>
          {user ? (
            <motion.div className="flex flex-col items-center justify-center">
              <Avatar name={user.username} size={20} />
              <motion.h3
                className="mt-2 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>Here, {user.name}</Balancer>
              </motion.h3>
              <motion.div className="mt-4 w-48">
                {session?.user ? (
                  <SignOutButton />
                ) : (
                  <div className="mt-4 text-center">
                    <Link href="/sign">去登录</Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col">User Not Found</div>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  // You should remove this try-catch block once your MongoDB Cluster is fully provisioned
  // try {
  //   await clientPromise;
  // } catch (e: any) {
  //   // cluster is still provisioning
  //   return {
  //     paths: [],
  //     fallback: true,
  //   };
  // }

  const results = await getAllUsers();

  const paths = results.flatMap(({ users }) => {
    return users.map((user) => {
      return {
        params: { username: user?.username ? user.username : user.email },
      };
    });
  });

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
  // const user_email = await getUserByEmail("songsonghhhh@gmail.com");
  console.log("[User]", user?.username);
  // console.log("[user_email]", user_email?.email);

  if (!user) {
    return {
      notFound: true,
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
