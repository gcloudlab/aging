import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Layout from "@/components/layout";
import { MetaProps, defaultMetaProps } from "@/components/layout/meta";
import { getUser, getAllUsers, getUserCount, UserProps } from "@/lib/api/user";
// export { default } from ".";
import clientPromise from "@/lib/mongodb";
import { useState } from "react";
import { GitHubIcon, LoadingDots } from "@/components/icons";
import Avatar from "@/components/avatar";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";

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
            <div className="flex flex-col items-center justify-center">
              <Avatar />
              <div className="mt-3 w-48">
                {session?.user && (
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className={`h-10 w-48 rounded-md border bg-white px-2 py-1 text-sm text-black transition-all hover:bg-black hover:text-white`}
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
