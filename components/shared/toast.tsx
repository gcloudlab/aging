import { getGradient } from "@/lib/gradients";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Toast({ username }: { username?: string }) {
  const [bannerHidden, setBannerHidden] = useState(true);

  useEffect(() => {
    setBannerHidden(Cookies.get("mongo-banner-hidden") === "true");
  }, []);

  return bannerHidden ? null : (
    <div
      className={`rounded-[16px] ${getGradient(
        username,
      )} absolute bottom-10 left-0 right-0 z-10 mx-auto h-[160px] w-11/12 p-0.5 sm:h-[80px] sm:w-[581px]`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center space-y-3 rounded-[14px] bg-[#111111] px-5 sm:flex-row sm:justify-between sm:space-y-0">
        <p className="flex h-[40px] w-[304px] items-center justify-center p-3 font-mono text-[13px] text-white">
          Get started with MongoDB Atlas and Vercel instantly.{" "}
          <button
            className="contents font-bold text-blue-400 underline"
            onClick={() => {
              setBannerHidden(true);
              Cookies.set("mongo-banner-hidden", "true");
            }}
          >
            Dismiss →
          </button>
        </p>
        <a
          className="flex h-[40px] w-[220px] items-center justify-center whitespace-nowrap rounded-md border border-[#333333] bg-black font-mono text-[13px] text-white transition-all hover:border-white"
          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fmongodb-starter&project-name=mongodb-nextjs&repo-name=mongodb-nextjs&demo-title=MongoDB%20Developer%20Directory&demo-description=Log%20in%20with%20GitHub%20to%20create%20a%20directory%20of%20contacts.&demo-url=https%3A%2F%2Fmongodb.vercel.app%2F&demo-image=https%3A%2F%2Fmongodb.vercel.app%2Fog.png&integration-ids=oac_jnzmjqM10gllKmSrG0SGrHOH&env=NEXTAUTH_SECRET&envDescription=Generate%20one%20at%20https%3A%2F%2Fgenerate-secret.now.sh%2F32&envLink=https://next-auth.js.org/deployment#vercel"
          target="_blank"
          rel="noreferrer"
        >
          Clone & Deploy
        </a>
      </div>
    </div>
  );
}
