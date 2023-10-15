import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthSession } from "../auth/[...nextauth]/route";

const f = createUploadthing();

const getUser = async () => await getAuthSession();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      const session = await getUser();
      const user = session?.user;

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userEmail: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
