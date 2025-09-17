"use server";

import { revalidatePath } from "next/cache";
import { Promotion, PromotionFormData } from "@/lib/types";

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/promotions`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar promoções");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar promoções:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

export async function createPromotion(data: PromotionFormData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/promotions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar a promoção");
    }

    revalidatePath("/dashboard/promotions");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao criar a promoção!", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function updatePromotion(
  promotionId: string,
  data: Partial<PromotionFormData>
) {
  try {
    // Busca a promoção existente para verificar a imagem antiga
    const existingPromotionRes = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/promotions/${promotionId}`
    );
    if (!existingPromotionRes.ok) {
      throw new Error("Promoção não encontrada para atualização.");
    }
    const existingPromotion: Promotion = await existingPromotionRes.json();

    // Verifica se a URL da imagem mudou e se a antiga existia
    if (
      data.imageUrl !== existingPromotion.imageUrl &&
      existingPromotion.imageUrl
    ) {
      const fileKey = existingPromotion.imageUrl.substring(
        existingPromotion.imageUrl.lastIndexOf("/") + 1
      );
      // Deleta a imagem antiga
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/uploadthing/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey }),
      });
    }

    // Atualiza a promoção com os novos dados
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/promotions/${promotionId}`,
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
      throw new Error(errorData.message || "Erro ao atualizar a promoção");
    }

    revalidatePath("/dashboard/promotions");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao atualizar a promoção!", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function deletePromotion(promotionId: string) {
  try {
    // Primeiro, busca a promoção para obter a URL da imagem
    const promotionRes = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/promotions/${promotionId}`
    );
    if (!promotionRes.ok) {
      throw new Error("Promoção não encontrada.");
    }
    const promotion: Promotion = await promotionRes.json();

    // Se existir uma imagem, exclui do UploadThing
    if (promotion.imageUrl) {
      const fileKey = promotion.imageUrl.substring(
        promotion.imageUrl.lastIndexOf("/") + 1
      );
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/uploadthing/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey }),
      });
    }

    // Depois, exclui a promoção do banco de dados
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/promotions/${promotionId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao excluir a promoção");
    }

    revalidatePath("/dashboard/promotions");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar a promoção!", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}
