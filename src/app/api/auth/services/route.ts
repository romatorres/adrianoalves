import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, duration, imageUrl, active } = body;

    if (!name || !description || !price || !duration) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        imageUrl,
        active,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { message: "Erro ao criar um serviço." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        active: true,
        imageUrl: true,
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Erro ao buscar um serviço." },
      { status: 500 }
    );
  }
}
