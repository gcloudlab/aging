import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Layout from "@/components/layout";
import { MetaProps, defaultMetaProps } from "@/components/layout/meta";
import { getUser, getAllUsers, getUserCount, UserProps } from "@/lib/api/user";
// export { default } from ".";
import clientPromise from "@/lib/mongodb";

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

  return (
    <Layout>
      <div className="z-10">Hi, {user?.name}</div>
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
