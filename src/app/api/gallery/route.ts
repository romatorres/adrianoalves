import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, featured, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const newGalleryImage = await prisma.galleryImage.create({
      data: {
        title,
        description,
        imageUrl,
        featured: Boolean(featured),
        active: Boolean(active),
      },
    });
    return NextResponse.json(newGalleryImage, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { message: "Erro ao criar uma galeria." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const galleryImage = await prisma.galleryImage.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        featured: true,
        active: true,
      },
    });

    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { message: "Erro ao buscar uma galeria." },
      { status: 500 }
    );
  }
}
