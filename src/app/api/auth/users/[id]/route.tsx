import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, email, password } = await request.json();
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (name) {
      updateData.name = name;
    }
    if (email) {
      updateData.email = email;
    }
    if (password) {
      // Se uma nova senha for fornecida, criptografá-la
      updateData.password = password; // Aqui você pode adicionar a lógica de hash se necessário
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error editing user:", error);
    return NextResponse.json(
      { message: "Erro ao editar usuário." },
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
    await prisma.user.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Erro ao excluir usuário." },
      { status: 500 }
    );
  }
}
