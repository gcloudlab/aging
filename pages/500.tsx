import Layout from "@/components/layout";
export { getStaticProps } from ".";

export default function Custom500() {
  return (
    <Layout
      meta={{ title: "500 | Oh my life", ogUrl: "https://ai.aging.run/500" }}
    >
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <h1 className="text-2xl font-light text-white">
          500 <span className="mx-3 text-4xl">|</span> Server error
        </h1>
      </div>
    </Layout>
  );
}
