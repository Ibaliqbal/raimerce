import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError, UTApi } from "uploadthing/server";
import { authOptions } from "./auth";
import { TMedia } from "@/types/product";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "2MB" } })
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ file }) => {
      const media: TMedia = {
        keyFile: file.key,
        type: "image",
        name: file.name,
        url: file.url,
      };

      return { media };
    }),
  mediaPost: f({
    image: { maxFileSize: "2MB", maxFileCount: 4 },
    video: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),
  uploadHeaderPhotoStore: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async ({ req, res }) => {
      const user = await getServerSession(req, res, authOptions);

      if (!user)
        throw new UploadThingError("You must be logged in to upload a file");

      return { userId: user.user.id };
    })
    .onUploadComplete(async (data) => {
      const media: TMedia = {
        keyFile: data.file.key,
        type: "image",
        name: data.file.name,
        url: data.file.url,
      };

      return { media };
    }),
  uploadMediaNews: f({
    image: { maxFileSize: "2MB", maxFileCount: 4 },
  }).onUploadComplete(async (data) => {
    const media: TMedia = {
      keyFile: data.file.key,
      type: "image",
      name: data.file.name,
      url: data.file.url,
    };

    return { media };
  }),
} satisfies FileRouter;

const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;

export { utapi, ourFileRouter };
