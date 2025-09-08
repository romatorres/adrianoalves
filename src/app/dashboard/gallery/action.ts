"use server";

import { revalidatePath } from "next/cache";
import { GalleryImage } from "@/lib/types";

export async function getGalleryImage(): Promise<GalleryImage[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gallery`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar galeria de imagens");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar galeria!", error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

export async function createGalleryImage(data: Omit<GalleryImage, "id">) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar galeria de imagens");
    }

    revalidatePath("/dashboard/gallery");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao criar galeria de imagens!", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function updateGalleryImage(
  galleryId: string,
  data: Partial<Omit<GalleryImage, "id">>
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/gallery/${galleryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao atualizar galeria");
    }

    revalidatePath("/dashboard/gallery");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao atualizar galeria:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function deleteGalleryImage(galleryId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/gallery/${galleryId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Tenta pegar corpo do erro
      throw new Error(errorData.message || "Erro ao excluir galeria");
    }

    revalidatePath("/dashboard/gallery");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar uma galeria:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}
