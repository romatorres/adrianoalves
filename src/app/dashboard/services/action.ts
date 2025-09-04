"use server";

import { revalidatePath } from "next/cache";
import { Service } from "@/lib/types";

export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/services`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar serviços");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

export async function createService(data: Omit<Service, "id">) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar o serviço");
    }

    revalidatePath("/dashboard/services");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao criar o serviço:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function updateService(
  serviceId: string,
  data: Partial<Omit<Service, "id">>
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/services/${serviceId}`,
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
      throw new Error(errorData.message || "Erro ao atualizar o serviço");
    }

    revalidatePath("/dashboard/services");
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}

export async function deleteService(serviceId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/services/${serviceId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Tenta pegar corpo do erro
      throw new Error(errorData.message || "Erro ao excluir serviço");
    }

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar o serviço:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}
