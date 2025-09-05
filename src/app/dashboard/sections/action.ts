"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSections() {
  try {
    const sectionsToUpsert = [
      { name: "gallery", active: true },
      { name: "products", active: true },
      { name: "promotions", active: true },
      { name: "services", active: true },
      { name: "team", active: true },
    ];

    for (const section of sectionsToUpsert) {
      await prisma.sectionVisibility.upsert({
        where: { name: section.name },
        update: {},
        create: {
          name: section.name,
          active: section.active,
        },
      });
    }

    const sections = await prisma.sectionVisibility.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return sections;
  } catch (error) {
    console.error("Error fetching sections:", error);
    return { error: "Erro ao buscar as seções." };
  }
}

export async function updateSectionStatus(id: string, active: boolean) {
  try {
    await prisma.sectionVisibility.update({
      where: { id },
      data: { active },
    });
    revalidatePath("/dashboard/sections");
    return { success: true };
  } catch (error) {
    console.error("Error updating section status:", error);
    return { error: "Erro ao atualizar a seção." };
  }
}
