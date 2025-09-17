import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const promotion = await prisma.promotion.findUnique({
      where: { id: id },
    });

    if (!promotion) {
      return NextResponse.json({ message: "Promoção não encontrada." }, { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar uma promoção." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      discount,
      active,
    } = await request.json();

    const promotionUpdateData: {
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      discount?: Decimal | number | null;
      imageUrl?: string;
      active?: boolean;
    } = {};

    if (title !== undefined) promotionUpdateData.title = title;
    if (description !== undefined)
      promotionUpdateData.description = description;
    if (startDate !== undefined) promotionUpdateData.startDate = startDate;
    if (endDate !== undefined) promotionUpdateData.endDate = endDate;
    if (discount !== undefined) promotionUpdateData.discount = discount;
    if (imageUrl !== undefined) promotionUpdateData.imageUrl = imageUrl;
    if (active !== undefined) promotionUpdateData.active = Boolean(active);

    if (Object.keys(promotionUpdateData).length > 0) {
      await prisma.promotion.update({
        where: { id: id },
        data: promotionUpdateData,
      });
    }

    // Buscar e retornar o serviço atualizado
    const updatedpromotion = await prisma.promotion.findUnique({
      where: { id: id },
    });

    return NextResponse.json(updatedpromotion);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao editar uma promoção." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    await prisma.promotion.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao excluir uma promoção." },
      { status: 500 }
    );
  }
}
