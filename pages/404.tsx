import Layout from "@/components/layout";
export { getStaticProps } from ".";

export default function Custom404() {
  return (
    <Layout
      meta={{ title: "404 | Oh my life", ogUrl: "https://ai.aging.run/404" }}
    >
      <div className="z-10 flex w-full items-center justify-center">
        <h1 className="text-2xl font-light text-white">
          404 <span className="mx-3 text-4xl">|</span> User Not Found
        </h1>
      </div>
    </Layout>
  );
}
