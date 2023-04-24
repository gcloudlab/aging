import { UserProps } from "@/lib/api/user";
import { getGradient } from "@/lib/gradients";
import {
  CheckInCircleIcon,
  CheckIcon,
  EditIcon,
  GitHubIcon,
  LoadingDots,
  UploadIcon,
  XIcon,
} from "@/components/icons";
import { useSession } from "next-auth/react";
import BlurImage from "../blur-image";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import TextareaAutosize from "react-textarea-autosize";
import { MDXRemote } from "next-mdx-remote";

export const profileWidth = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8";

export default function Profile({
  settings,
  user,
}: {
  settings?: boolean;
  user: UserProps;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    username: user.username,
    image: user.image,
    bio: user.bio || "",
    bioMdx: user.bioMdx,
  });

  if (data.username !== user.username) {
    setData(user);
  }

  const [error, setError] = useState("");
  const settingsPage =
    settings ||
    (router.query.settings === "true" && router.asPath === "/settings");

  const handleDismiss = useCallback(() => {
    if (settingsPage) router.replace(`/${user.username}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const bioMdx = await response.json();
        setData({
          ...data,
          bioMdx,
        }); // optimistically show updated state for bioMdx
        router.replace(`/${user.username}`, undefined, { shallow: true });
      } else if (response.status === 401) {
        setError("Not authorized to edit this profile.");
      } else {
        setError("Error saving profile.");
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onKeyDown = async (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleDismiss();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      await handleSave();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div className="min-h-screen pb-20">
      <div>
        <div
          className={`h-48 w-full lg:h-64 
          ${getGradient(user.username)}`}
        />
        <div
          className={`${profileWidth} -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5`}
        >
          <div className="group relative h-24 w-24 overflow-hidden rounded-full sm:h-32 sm:w-32">
            {settingsPage && (
              <button
                className="absolute z-10 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50 transition-all hover:bg-opacity-70"
                onClick={() =>
                  alert("Image upload has been disabled for demo purposes.")
                }
              >
                <UploadIcon className="h-6 w-6 text-white" />
              </button>
            )}
            <BlurImage
              src={user.image}
              alt={user.name}
              width={300}
              height={300}
            />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="flex min-w-0 flex-1 items-center space-x-2">
              <h1 className="truncate text-2xl font-semibold text-white">
                {user.name}
              </h1>
              {user.verified && (
                <CheckInCircleIcon className="h-6 w-6 text-[#0070F3]" />
              )}
            </div>
            {user.verified ? (
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <a
                  href={`https://github.com/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-md border border-gray-800 bg-black px-4 py-2 font-mono text-sm font-medium text-white shadow-sm transition-all hover:border-white focus:outline-none focus:ring-0"
                >
                  <GitHubIcon className="mr-3 h-5 w-5 text-white" />
                  <span>View GitHub Profile</span>
                </a>
              </div>
            ) : (
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <a
                  href="https://github.com/vercel/mongodb-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-md border border-gray-800 bg-black px-4 py-2 font-mono text-sm font-medium text-white shadow-sm transition-all hover:border-white focus:outline-none focus:ring-0"
                >
                  <GitHubIcon className="mr-3 h-5 w-5 text-white" />
                  <span>Demo Account</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 sm:mt-2 2xl:mt-5">
        <div className="border-b border-gray-800">
          <div className={`${profileWidth} mt-10`}>
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  disabled={tab.name !== "Profile"}
                  className={`${
                    tab.name === "Profile"
                      ? "border-white text-white"
                      : "cursor-not-allowed border-transparent text-gray-400"
                  }
                    whitespace-nowrap border-b-2 px-1 py-3 font-mono text-sm font-medium`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={`${profileWidth} mt-16`}>
        <h2 className="font-mono text-2xl font-semibold text-white">Bio</h2>
        {settingsPage ? (
          <>
            <TextareaAutosize
              name="description"
              onInput={(e) => {
                setData({
                  ...data,
                  bio: (e.target as HTMLTextAreaElement).value,
                });
              }}
              className="mt-1 w-full max-w-2xl resize-none border-0 border-b border-gray-800 bg-black px-0 font-mono text-sm leading-6 tracking-wider text-white focus:border-white focus:outline-none focus:ring-0"
              placeholder="Enter a short bio about yourself... (Markdown supported)"
              value={data.bio}
            />
            <div className="flex w-full max-w-2xl justify-end">
              <p className="font-mono text-sm text-gray-400">
                {data.bio.length}/256
              </p>
            </div>
          </>
        ) : (
          <article className="prose mt-3 max-w-2xl font-mono text-sm leading-6 tracking-wider text-white prose-headings:text-white prose-a:text-white">
            {/* <MDXRemote {...data.bioMdx} /> */}
          </article>
        )}
      </div>

      {/* Edit buttons */}
      {settingsPage ? (
        <div className="fixed bottom-10 right-10 flex items-center space-x-3">
          <p className="text-sm text-gray-500">{error}</p>
          <button
            className={`${
              saving ? "cursor-not-allowed" : ""
            } flex h-12 w-12 items-center justify-center rounded-full border border-[#0070F3] transition-all hover:border-2`}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <LoadingDots color="white" />
            ) : (
              <CheckIcon className="h-4 w-4 text-white" />
            )}
          </button>
          <Link href={`/${user.username}`} shallow replace scroll={false}>
            <a className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 transition-all hover:border-white">
              <XIcon className="h-4 w-4 text-white" />
            </a>
          </Link>
        </div>
      ) : session?.username === user.username ? (
        <Link
          href={{ query: { settings: true } }}
          as="/settings"
          shallow
          replace
          scroll={false}
        >
          <a className="fixed bottom-10 right-10 flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 bg-black transition-all hover:border-white">
            <EditIcon className="h-4 w-4 text-white" />
          </a>
        </Link>
      ) : null}
    </div>
  );
}

const tabs = [
  { name: "Profile" },
  { name: "Work History" },
  { name: "Contact" },
];
