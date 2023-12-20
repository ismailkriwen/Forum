"use client";

import { TOPUP_BONUS } from "@/constants";
import { UpdateBalance } from "@/lib/actions/user.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("session_id");
  const fn = useCallback(async () => {
    await fetch(`/api/checkout_session/id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.checkout_session) {
          const balance =
            (data.checkout_session.amount_total / 100) * TOPUP_BONUS;
          const response = await UpdateBalance(balance);
          if (!response.error) router.push("/shop");
          else router.push("/topup");
        }
      });
  }, []);

  useEffect(() => {
    fn();
  }, [fn]);

  return <></>;
}
