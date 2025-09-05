import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, bio, instagram, facebook, linkedin, imageUrl, active } =
      await request.json();

    const teamUpdateData: {
      name?: string;
      bio?: string;
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      imageUrl?: string;
      active?: boolean;
    } = {};

    if (name !== undefined) teamUpdateData.name = name;
    if (bio !== undefined) teamUpdateData.bio = bio;
    if (instagram !== undefined) teamUpdateData.instagram = instagram;
    if (facebook !== undefined) teamUpdateData.facebook = facebook;
    if (linkedin !== undefined) teamUpdateData.linkedin = linkedin;
    if (imageUrl !== undefined) teamUpdateData.imageUrl = imageUrl;
    if (active !== undefined) teamUpdateData.active = Boolean(active);

    if (Object.keys(teamUpdateData).length > 0) {
      await prisma.teamMember.update({
        where: { id: id },
        data: teamUpdateData,
      });
    }

    // Buscar e retornar o serviço atualizado
    const updatedTeamMember = await prisma.teamMember.findUnique({
      where: { id: id },
    });

    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error("Error editing team:", error);
    return NextResponse.json(
      { message: "Erro ao editar um membro." },
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
    await prisma.teamMember.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { message: "Erro ao excluir um membro." },
      { status: 500 }
    );
  }
}
