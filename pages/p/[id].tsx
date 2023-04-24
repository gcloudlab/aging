import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { ParsedUrlQuery } from "node:querystring";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import Layout from "@/components/layout";
import { getData, DataProps } from "@/lib/upstash";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import PhotoBooth from "@/components/home/photo-booth";
import { getPlaiceholder } from "plaiceholder";
import { useUploadModal } from "@/components/home/upload-modal";
import { Upload } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function PhotoPage({
  input,
  blurDataURL,
  data: fallbackData,
}: {
  input: string;
  blurDataURL: string;
  data: DataProps;
}) {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR<DataProps>(`/api/images/${id}`, fetcher, {
    fallbackData,
    refreshInterval: fallbackData.output || fallbackData.expired ? 0 : 500,
    refreshWhenHidden: true,
  });
  const { UploadModal, setShowUploadModal } = useUploadModal();

  return (
    <Layout>
      <Toaster />
      <UploadModal />
      <motion.div
        className="z-10 max-w-2xl px-5 xl:px-0"
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
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          你的推演
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer ratio={0.6}>
            您的照片将在我们的服务器中存储24小时，之后将被删除。
          </Balancer>
        </motion.p>
        {data?.expired ? (
          <motion.div
            className="mx-auto mt-10 flex h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white sm:h-[600px] sm:w-[600px]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <p className="text-sm text-gray-500">
              您的照片已被删除，请上传一张新照片
            </p>
            <button
              className="group mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-5 w-5 text-white group-hover:text-black" />
              <p>上传另一张</p>
            </button>
          </motion.div>
        ) : (
          <PhotoBooth
            input={input}
            blurDataURL={blurDataURL}
            output={data!.output}
            failed={data!.failed}
          />
        )}
      </motion.div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps = async (
  context: GetStaticPropsContext & { params: Params },
) => {
  const { id } = context.params;
  const input = `${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER}/${id}`;
  const data = await getData(id);
  if (data) {
    let imageData: { base64: string } | undefined;
    try {
      imageData = await getPlaiceholder(input);
    } catch (error) {
      console.error(error);
    }
    const { base64 } = imageData || {};
    return {
      props: {
        input,
        blurDataURL: base64 || "",
        data,
      },
      revalidate: 1,
    };
  } else {
    return { notFound: true, revalidate: 1 };
  }
};
