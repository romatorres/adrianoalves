import { createUploadthing, type FileRouter } from "uploadthing/next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Defina quantos FileRoutes desejar, cada um com um nome exclusivo
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Defina permissões e tipos de arquivo para este FileRoute
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new Error("Não autorizado");
      }

      // Tudo o que for retornado aqui estará acessível em onUploadComplete como `metadados`
      return { userId: session.user.id };
    })

    .onUploadComplete(async ({ metadata }) => {
      // Este código é executado em seu servidor após o upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
