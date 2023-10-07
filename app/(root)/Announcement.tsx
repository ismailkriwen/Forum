import { prisma } from "@/lib/db";

export const Announcement = async () => {
  const announcement = await prisma.announcement.findFirst({
    select: { shown: true, content: true },
  });

  return (
    <>
      {announcement?.shown && (
        <div className="border-2 dark:border-danger border-rose-600 text-rose-600 dark:text-danger py-2 px-4 rounded mt-4 mb-2 w-full">
          <pre className="w-full overflow-x-auto">{announcement.content}</pre>
        </div>
      )}
    </>
  );
};
