import { NextResponse } from "next/server";
import { getAuthSession } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export const GET = async () => {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Not authorized" });

  const notifications = await prisma.notification.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ notifications });
};
