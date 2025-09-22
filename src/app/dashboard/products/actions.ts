"use server";

import { revalidatePath } from "next/cache";
import { Product } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products?showAll=true`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

export async function createProducts(data: Omit<Product, "id">) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar o produto");
    }

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao criar o produto:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function updateProducts(
  productId: string,
  data: Partial<Omit<Product, "id">>
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`,
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
      throw new Error(errorData.message || "Erro ao atualizar o produto");
    }

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao atualizar o produto:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function deleteProducts(productId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Tenta pegar corpo do erro
      throw new Error(errorData.message || "Erro ao excluir produto");
    }

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar o produto:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}
