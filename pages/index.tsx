import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { useUploadModal } from "@/components/home/upload-modal";
import { Upload } from "lucide-react";
import PhotoBooth from "@/components/home/photo-booth";
import { redis } from "@/lib/upstash";
import Tooltip from "@/components/shared/tooltip";
import { nFormatter } from "@/lib/utils";

export default function Home({ count }: { count: number }) {
  const { UploadModal, setShowUploadModal } = useUploadModal();
  return (
    <Layout>
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
          <Balancer>Oh My Life</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer ratio={0.6}>
            想知道自己十年后、二十年后或者九十岁的样子会是怎样的吗？上传一张照片，就能找到答案！{" "}
            <Tooltip
              content={
                <div className="flex flex-col items-center justify-center space-y-3 p-10 text-center sm:max-w-xs">
                  <p className="text-sm text-gray-700">
                    您上传的所有照片将在24小时后自动销毁.
                  </p>
                </div>
              }
            >
              {/* <span className="hidden cursor-default underline decoration-dotted underline-offset-2 transition-colors hover:text-gray-800 sm:block">
                正在免费且保护隐私
              </span> */}
            </Tooltip>
          </Balancer>
        </motion.p>
        <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="-mb-4">
          <button
            className="group mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-5 w-5 text-white group-hover:text-black" />
            <p>上传照片</p>
          </button>
          <p className="mt-2 text-center text-sm text-gray-500">
            已经生成 {nFormatter(count)} 张照片！
          </p>
        </motion.div>
        <PhotoBooth
          input={`https://i.postimg.cc/2SzK7qND/R-4.jpg`}
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/ALjj/4mIh+P+/9Lv/wCn0+xeLxV9cWWUtL0AUz0tKQAAeVU0j4d/y2cTsDiuaawAAAAASUVORK5CYII="
          output={`https://i.postimg.cc/gJ5CMGqK/P48bjUM.gif`}
        />
      </motion.div>
    </Layout>
  );
}

export async function getStaticProps() {
  const count = await redis.dbsize();
  return {
    props: {
      count,
    },
    revalidate: 60,
  };
}
