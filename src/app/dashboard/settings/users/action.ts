"use server";

import { revalidatePath } from "next/cache";
import { UserType } from "@/lib/types";

export async function getUsers(): Promise<UserType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/users`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar usuários");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

export async function deleteUser(userId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Tenta pegar corpo do erro
      throw new Error(errorData.message || "Erro ao excluir usuário");
    }

    revalidatePath("/dashboard/settings/users");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao excluir usuário:", error);
    return { success: false, message: error.message };
  }
}