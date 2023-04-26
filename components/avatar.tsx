import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Avatar({ size = 9 }: { size?: number }) {
  const { data: session, status } = useSession();

  return (
    session && (
      <Link href={`/${session.username}`}>
        <Image
          width={100}
          height={100}
          className={`h-${size} w-${size} overflow-hidden rounded-full`}
          src={
            session.user?.image ||
            `https://avatar.tobi.sh/${session.user?.name}`
          }
          alt={session.user?.name || "User"}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
        />
      </Link>
    )
  );
}
