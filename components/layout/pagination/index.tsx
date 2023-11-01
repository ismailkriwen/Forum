"use client";

import { SITE_NAME } from "@/constants";
import { unslug } from "@/lib/slugify";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

const removeDuplicates = <T,>(array: T[]) =>
  array.filter((item, index) => array.indexOf(item) === index);

export const Pagination = () => {
  const pathname = usePathname();
  const [routes, setRoutes] = useState<string[]>([]);

  useEffect(() => {
    setRoutes(removeDuplicates(pathname.split("/")));
  }, [pathname]);

  return (
    <div className="relative">
      <div className="relative rounded-sm px-6 py-2 mb-2 shadow-md dark:shadow-white/5 bg-gray-50/75 dark:bg-neutral-900/75 max-w-full overflow-x-auto">
        {routes.length === 0 ? (
          <div className="flex items-center">
            <div className="w-12 h-2 rounded bg-gray-300 animate-pulse"></div>
            <span className="px-2">/</span>
            <div className="w-12 h-2 rounded bg-gray-300 animate-pulse"></div>
          </div>
        ) : (
          <>
            {routes.map((route, index) => {
              return (
                <Fragment key={index}>
                  {index === routes.length - 1 ? (
                    <Fragment>
                      {route === "" ? SITE_NAME : unslug(route)}
                    </Fragment>
                  ) : (
                    <Link
                      href={`${
                        route === ""
                          ? "/"
                          : pathname.substring(
                              0,
                              pathname.length - routes[routes.length - 1].length
                            )
                      }`}
                    >
                      {route === "" ? SITE_NAME : unslug(route)}
                    </Link>
                  )}
                  {index !== routes.length - 1 && (
                    <span className="px-2">/</span>
                  )}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
