
import { UTApi } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { fileKey } = await req.json();

  if (!fileKey) {
    return NextResponse.json(
      { error: "A chave do arquivo é obrigatória" },
      { status: 400 }
    );
  }

  try {
    await utapi.deleteFiles(fileKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar o arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao deletar o arquivo" },
      { status: 500 }
    );
  }
}
