import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
){
    try{
        const { id } = await context.params;
        const { name, description, price, active, imageUrl } = await request.json();
        const productUpdateData: {
      name?: string;
      description?: string;
      price?: Decimal;
      active?: boolean;
      imageUrl?: string | null;
    } = {};

    if (name !== undefined) productUpdateData.name = name;
    if (description !== undefined) productUpdateData.description = description;
    if (price !== undefined) productUpdateData.price = new Decimal(price); // Convert to Decimal
    if (active !== undefined) productUpdateData.active = Boolean(active);
    if (imageUrl !== undefined) productUpdateData.imageUrl = imageUrl;

    if (Object.keys(productUpdateData).length > 0) {
      await prisma.product.update({
        where: { id: id },
        data: productUpdateData,
      });
    }

    const updatedProduct = await prisma.product.findUnique({
        where: { id: id },
    })
    // Convert Decimal to number for JSON serialization
    const serializedProduct = {
      ...updatedProduct,
      price: updatedProduct?.price instanceof Decimal ? updatedProduct.price.toNumber() : updatedProduct?.price,
    };
    
    return NextResponse.json(serializedProduct);
    }catch(error){
        console.error("Error editing product:", error);
         return NextResponse.json(
      { message: "Erro ao editar um produto." },
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
    await prisma.product.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Erro ao excluir um produto." },
      { status: 500 }
    );
  }
}