"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ProductsForm } from "../_components/products-form";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Cadastrar Novo Produto</h1>
            <p className="text-gray-600 mt-1">
              Preencha os detalhes para adicionar um novo produto.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/products">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
        <ProductsForm />
      </div>
    </div>
  );
}
