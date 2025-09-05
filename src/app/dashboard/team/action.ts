"use server";

import { revalidatePath } from "next/cache";
import { Team } from "@/lib/types";

export async function getTeamMember(): Promise<Team[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/team`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar membrosa da equipe");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

export async function createTeamMember(data: Omit<Team, "id">) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar o membro do time");
    }

    revalidatePath("/dashboard/team");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao criar o membro do time:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function updateTeamMember(
  teamId: string,
  data: Partial<Omit<Team, "id">>
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/team/${teamId}`,
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
      throw new Error(
        errorData.message || "Erro ao atualizar o membro do time"
      );
    }

    revalidatePath("/dashboard/team");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao atualizar o membro do time:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function deleteTeamMember(teamId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/team/${teamId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Tenta pegar corpo do erro
      throw new Error(errorData.message || "Erro ao excluir um membro do time");
    }

    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar um membro do time:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}
