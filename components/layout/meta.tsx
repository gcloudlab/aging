import Head from "next/head";

export const defaultMetaProps = {
  title: "Aging | Oh my life",
  description:
    "只需上传一张你现在的照片，Aging 将利用人工智能技术推演出你从幼年到老年的面容变化。",
  ogImage: ``,
  ogUrl: "https://ai.aging.run",
};

export interface MetaProps {
  title: string;
  description?: string;
  ogUrl?: string;
  ogImage?: string;
}

export default function Meta({ props }: { props: MetaProps }) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3965073406028614"
        crossOrigin="anonymous"
      ></script>
    </Head>
  );
}
