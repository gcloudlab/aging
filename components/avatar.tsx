import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Avatar() {
  const { data: session, status } = useSession();

  return (
    session && (
      <Link href={`/${session.username}`}>
        <a>
          <Image
            className="h-9 w-9 overflow-hidden rounded-full"
            src={
              session.user?.image ||
              `https://avatar.tobi.sh/${session.user?.name}`
            }
            alt={session.user?.name || "User"}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
          />
        </a>
      </Link>
    )
  );
}
