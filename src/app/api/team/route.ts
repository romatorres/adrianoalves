import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, bio, imageUrl, instagram, facebook, linkedin, active } = body;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const newTeamMember = await prisma.teamMember.create({
      data: {
        name,
        bio,
        imageUrl,
        instagram,
        facebook,
        linkedin,
        active: Boolean(active),
      },
    });
    return NextResponse.json(newTeamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating tem:", error);
    return NextResponse.json(
      { message: "Erro ao criar um membro da equipe." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      select: {
        id: true,
        name: true,
        bio: true,
        imageUrl: true,
        instagram: true,
        facebook: true,
        linkedin: true,
        active: true,
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { message: "Erro ao buscar um membro da equipe." },
      { status: 500 }
    );
  }
}
