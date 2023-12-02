import { UserInventory } from "@/lib/actions/badge.actions";
import { Spinner, Tooltip } from "@nextui-org/react";
import { Badge, User } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type TBadge = {
  user: User;
} & Badge;

export const ProfileBadges = ({ email }: { email: string }) => {
  const [badges, setBadges] = useState<TBadge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await UserInventory({ email });
      res && setBadges(res as TBadge[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return (
    <div className="bg-gray-3200/90 dark:bg-neutral-900/80 px-6 py-4 mt-2">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner color="default" />
        </div>
      ) : (
        <>
          {badges?.map((badge) => (
            <Tooltip
              key={badge.id}
              size="sm"
              radius="sm"
              showArrow
              content={badge.name}
            >
              <div className="w-10 h-10 max-md:w-7 max-md:h-7 relative">
                <Image
                  src={badge.image}
                  alt={badge.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
            </Tooltip>
          ))}
        </>
      )}
    </div>
  );
};
