import { LoadingDots, AlertCircleIcon } from "@/components/icons";
import { MouseEvent, useState } from "react";

export default function ClusterProvisioning() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const res = await fetch("/api/seed");

    if (res.ok) {
      window.location.reload();
      setIsSubmitting(false);
      setError("");
    } else {
      const json = await res.json();

      setError(json.error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-l from-pink-300 via-purple-300 to-indigo-400">
      <div className="w-[26rem] rounded-[14px] bg-[#111111] p-4 text-white">
        <h1 className="text-center text-lg font-bold">Almost ready!</h1>
        <p className="mt-2 text-sm">
          It looks like your Database Cluster on MongoDB Atlas is not
          provisioned yet. Database could not be seeded during first deployment.
        </p>
        <button
          type="button"
          onClick={onClick}
          className="mt-4 flex h-[40px] w-full items-center justify-center whitespace-nowrap rounded-md border border-[#333333] bg-black font-mono text-[13px] text-white transition-all hover:border-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingDots color="white" /> : "Seed Database"}
        </button>

        <div className="text-center">
          <a
            href="https://cloud.mongodb.com/"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-gray-400 transition-all hover:text-white hover:underline"
          >
            Check cluster status
          </a>
        </div>

        {error && (
          <div className="mt-4 flex items-center space-x-1 text-sm text-red-500">
            <AlertCircleIcon className="h-4 w-4" />
            <p>
              <span className="font-bold">Error: </span>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
