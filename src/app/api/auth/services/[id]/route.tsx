import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, description, price, duration, active, imageUrl } =
      await request.json();

    const serviceUpdateData: {
      name?: string;
      description?: string;
      price?: Decimal;
      duration?: number;
      active?: boolean;
      imageUrl?: string | null;
    } = {};

    if (name !== undefined) serviceUpdateData.name = name;
    if (description !== undefined) serviceUpdateData.description = description;
    if (price !== undefined) serviceUpdateData.price = new Decimal(price); // Convert to Decimal
    if (duration !== undefined) serviceUpdateData.duration = parseInt(duration, 10); // Ensure integer
    if (active !== undefined) serviceUpdateData.active = Boolean(active);
    if (imageUrl !== undefined) serviceUpdateData.imageUrl = imageUrl;

    if (Object.keys(serviceUpdateData).length > 0) {
      await prisma.service.update({
        where: { id: id },
        data: serviceUpdateData,
      });
    }

    // Buscar e retornar o serviço atualizado
    const updatedService = await prisma.service.findUnique({
      where: { id: id },
    });
    
    // Convert Decimal to number for JSON serialization
    const serializedService = {
      ...updatedService,
      price: updatedService?.price instanceof Decimal ? updatedService.price.toNumber() : updatedService?.price,
    };
    
    return NextResponse.json(serializedService);
  } catch (error) {
    console.error("Error editing service:", error);
    return NextResponse.json(
      { message: "Erro ao editar um serviço." },
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
    await prisma.service.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { message: "Erro ao excluir um serviço." },
      { status: 500 }
    );
  }
}
