import Meta, { defaultMetaProps } from "@/components/layout/meta";
export { getStaticProps } from ".";

export default function Custom500() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <Meta
        props={{
          ...defaultMetaProps,
          title: "500 | Oh my life",
          ogUrl: "https://ai.aging.run/500",
        }}
      />
      <h1 className="text-2xl font-light text-white">
        500 <span className="mx-3 text-4xl">|</span> Server error
      </h1>
    </div>
  );
}
