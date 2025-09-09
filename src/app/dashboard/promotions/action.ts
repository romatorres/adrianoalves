"use server";

import { revalidatePath } from "next/cache";
import { Promotion } from "@/lib/types";

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

export async function createPromotion(data: Omit<Promotion, "id">) {
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
  data: Partial<Omit<Promotion, "id">>
) {
  try {
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/promotions/${promotionId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Tenta pegar corpo do erro
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
