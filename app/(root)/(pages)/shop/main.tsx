"use client";

import {
  FetchAllBadges,
  PurchaseBadge,
  UserInventory,
} from "@/lib/actions/badge.actions";
import { formatPrice } from "@/lib/utils";
import {
  Button,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Badge, User } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const ROWS_PER_PAGE = 10;
type TBadge = {
  user: User;
} & Badge;

export const PageComponent = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<TBadge[]>([]);
  const [inventory, setInventory] = useState<TBadge[]>([]);
  const [page, setPage] = useState(Number(searchParams.page) || 1);
  const pages = Math.ceil(badges.length / ROWS_PER_PAGE);
  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return badges.slice(start, end);
  }, [page, badges]);

  const bottomContent = useMemo(() => {
    return (
      <div className="p-2 flex items-center justify-between">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          size="md"
          radius="full"
        />
      </div>
    );
  }, [pages, page, badges.length, setPage]);

  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      const data = await FetchAllBadges();
      const inv = await UserInventory({});
      data && setBadges(data as TBadge[]);
      inv && setInventory(inv as TBadge[]);
    } catch (e: any) {
      throw new Error("Error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const purchase = async (id: string) => {
    PurchaseBadge({ productId: id });
    setTimeout(() => {
      fetchBadges();
    }, 250);
  };

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return (
    <Table
      aria-label="badges-table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      fullWidth
      radius="sm"
      className="z-0"
    >
      <TableHeader>
        <TableColumn align="start"> </TableColumn>
        <TableColumn align="center">Item Name</TableColumn>
        <TableColumn align="center">Description</TableColumn>
        <TableColumn align="center">Price</TableColumn>
        <TableColumn align="end"> </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"No Badges available."}
        items={items}
        loadingState={loading ? "loading" : "idle"}
        loadingContent={<Spinner color="default" />}
      >
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={44}
                  height={44}
                  className="object-contain rounded-full"
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="text-bold text-small capitalize">
                {item.name}{" "}
                {item.limited && (
                  <Chip
                    size="sm"
                    variant="shadow"
                    className="ml-1"
                    classNames={{
                      base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                      content: "drop-shadow shadow-black text-white",
                    }}
                  >
                    Limited
                  </Chip>
                )}
              </div>
            </TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              {item.price == 0 ? "Free" : formatPrice(item.price)}
            </TableCell>
            <TableCell>
              <div className="w-full text-center">
                {inventory.some((e) => e.id == item.id) ? (
                  <>Owned</>
                ) : (
                  <Button
                    size="sm"
                    color="secondary"
                    onPress={() => purchase(item.id)}
                  >
                    Purchase
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
