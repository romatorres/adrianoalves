import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      discount,
      active,
    } = body;

    if (!title) {
      return NextResponse.json(
        { message: "O campo 'título' é obrigatório." },
        { status: 400 }
      );
    }

    const newPromotion = await prisma.promotion.create({
      data: {
        title,
        description,
        imageUrl,
        startDate,
        endDate,
        discount,
        active: Boolean(active),
      },
    });
    return NextResponse.json(newPromotion, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro ao criar uma Promoção." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        startDate: true,
        endDate: true,
        discount: true,
        active: true,
      },
    });

    // Converter valores Decimal para número
    const formattedPromotions = promotions.map((promotion) => ({
      ...promotion,
      discount: promotion.discount ? Number(promotion.discount) : null,
    }));

    return NextResponse.json(formattedPromotions);
  } catch {
    return NextResponse.json(
      { message: "Erro ao buscar uma promoção." },
      { status: 500 }
    );
  }
}
