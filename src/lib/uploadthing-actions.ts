
"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteFile(fileKey: string) {
  try {
    await utapi.deleteFiles(fileKey);
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar o arquivo no UploadThing:", error);
    return { success: false, message: "Erro ao deletar o arquivo." };
  }
}
