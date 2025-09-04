import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, duration, imageUrl, active } = body;

    if (!name || !description || price === undefined || duration === undefined) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Convert types for Prisma
    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price: new Decimal(price), // Convert to Decimal
        duration: parseInt(duration, 10), // Ensure integer
        imageUrl,
        active: Boolean(active),
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
    
    // Convert Decimal to number for JSON serialization
    const serializedServices = services.map(service => ({
      ...service,
      price: service.price instanceof Decimal ? service.price.toNumber() : service.price,
    }));
    
    return NextResponse.json(serializedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Erro ao buscar um serviço." },
      { status: 500 }
    );
  }
}
