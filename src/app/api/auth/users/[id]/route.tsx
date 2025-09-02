import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, email, password } = await request.json();

    // 1. Atualizar dados do usuário (sem a senha)
    const userUpdateData: { name?: string; email?: string } = {};
    if (name) userUpdateData.name = name;
    if (email) userUpdateData.email = email;

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: id },
        data: userUpdateData,
      });
    }

    // 2. Atualizar a senha (se fornecida)
    if (password) {
      const hashedPassword = await hashPassword(password);
      await prisma.account.updateMany({
        where: {
          userId: id,
          providerId: "credential",
        },
        data: { password: hashedPassword },
      });
    }

    // 3. Buscar e retornar o usuário atualizado
    const updatedUser = await prisma.user.findUnique({ where: { id: id } });
    return NextResponse.json(updatedUser);

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
