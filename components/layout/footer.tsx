import { GitHubIcon } from "../icons";

export default function Footer() {
  return (
    <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
      <p className="flex justify-center text-gray-500">
        <a
          className=" font-semibold text-gray-600 transition-colors hover:text-black"
          href="https://github.com/gcloudlab/aging"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
      </p>
    </div>
  );
}
