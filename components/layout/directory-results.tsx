import Link from "next/link";
import BlurImage from "../blur-image";
import { UserProps } from "@/lib/api/user";
import { CheckInCircleIcon } from "@/components/icons";

export default function DirectoryResults({ users }: { users: UserProps[] }) {
  return (
    <ul role="list" className="directory-divide-y relative z-0">
      {users.map((user) => (
        <li key={user.username}>
          <Link href={`/${user.username}`}>
            <a>
              <div className="relative flex items-center space-x-3 px-6 py-4 focus-within:ring-0">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                  <BlurImage
                    src={user.image}
                    alt={user.name}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  <div className="flex items-center space-x-1">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name}
                    </p>
                    {user.verified && (
                      <CheckInCircleIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <p className="text-dark-accent-5 truncate text-sm">
                    @{user.username}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
