import Image from "next/image";
import Link from "next/link";

export default function Logo({}) {
  return (
    <Link href="/" className="flex items-center font-display text-2xl">
      <Image
        src="/logo.png"
        alt="Logo image of a chat bubble"
        width="30"
        height="30"
        className="mr-2 rounded-sm"
      ></Image>
      <p>Aging</p>
    </Link>
  );
}
