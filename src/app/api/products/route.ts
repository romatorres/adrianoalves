/* import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl, active } = body;

    if (!name || price === undefined) {
        return NextResponse.json(
            { message: "Todos os campos são obrigatórios." },
        { status: 400 }
        )
    }

    const newProduct = await prisma.product.create({
        data: {
            name,
            description,
            price: new Decimal(price), // Convert to Decimal
            imageUrl,
            active: Boolean(active),
        }
    })

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Erro ao criar um produto." },
      { status: 500 }
    );
  }
}
   */

/* export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("showAll") === "true";

    const whereClause = showAll ? {} : { active: true };

    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        active: true,
      },
    });
    // Convert Decimal to number for JSON serialization
    const serializedServices = products.map((product) => ({
      ...product,
      price:
        product.price instanceof Decimal
          ? product.price.toNumber()
          : product.price,
    }));

    return NextResponse.json(serializedServices);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Erro ao criar um produto." },
      { status: 500 }
    );
  }
} */
