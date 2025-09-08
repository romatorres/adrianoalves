import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { title, description, imageUrl, featured, active } =
      await request.json();

    const galleryUpdateData: {
      title?: string;
      description?: string;
      featured?: boolean;
      imageUrl?: string;
      active?: boolean;
    } = {};

    if (title !== undefined) galleryUpdateData.title = title;
    if (description !== undefined) galleryUpdateData.description = description;
    if (featured !== undefined) galleryUpdateData.featured = Boolean(featured);
    if (imageUrl !== undefined) galleryUpdateData.imageUrl = imageUrl;
    if (active !== undefined) galleryUpdateData.active = Boolean(active);

    if (Object.keys(galleryUpdateData).length > 0) {
      await prisma.galleryImage.update({
        where: { id: id },
        data: galleryUpdateData,
      });
    }

    // Buscar e retornar o serviço atualizado
    const updatedgalleryImage = await prisma.galleryImage.findUnique({
      where: { id: id },
    });

    return NextResponse.json(updatedgalleryImage);
  } catch (error) {
    console.error("Error editing gallery:", error);
    return NextResponse.json(
      { message: "Erro ao editar uma galeria." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.galleryImage.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { message: "Erro ao excluir uma galeria." },
      { status: 500 }
    );
  }
}
