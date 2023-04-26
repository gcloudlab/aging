import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Avatar({
  url,
  username,
  size = 9,
}: {
  url: string;
  username: string;
  size?: number;
}) {
  // const { data: session, status } = useSession();

  return url ? (
    <Link href={`/${username}`}>
      <Image
        width={100}
        height={100}
        className={`h-${size} w-${size} overflow-hidden rounded-full`}
        src={url || `https://avatar.tobi.sh/${username}`}
        alt={username || "Unkonw"}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
      />
    </Link>
  ) : (
    <Image
      width={100}
      height={100}
      className={`h-${size} w-${size} overflow-hidden rounded-full`}
      src={`/logo.png`}
      alt={"Unkonw"}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
    />
  );
}
