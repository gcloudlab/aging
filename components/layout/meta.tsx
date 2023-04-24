import Head from "next/head";

export default function Meta({
  title = "Aging - AI推演",
  description = "只需上传一张你现在的照片，Aging 将利用人工智能技术推演出你从幼年到老年的面容变化。",
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/vercel.svg" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
}