import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { active } = await request.json();

    const sectionUpdateData: {
      active?: boolean;
    } = {};

    if (active !== undefined) {
      sectionUpdateData.active = Boolean(active);
    }

    if (Object.keys(sectionUpdateData).length > 0) {
      await prisma.sectionVisibility.update({
        where: { id: id },
        data: sectionUpdateData,
      });
    }

    const updatedSection = await prisma.sectionVisibility.findUnique({
      where: { id: id },
    });

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { message: "Erro ao editar uma seção." },
      { status: 500 }
    );
  }
}
