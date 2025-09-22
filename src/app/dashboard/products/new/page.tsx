"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductsForm } from "../_components/products-form";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Novo Produto</h1>
            <p className="text-gray-600 mt-1">
              Preencha os detalhes para adicionar um novo produto.
            </p>
          </div>

          <Link href="/dashboard/products">
            <Button
              variant="ghost"
              className="mb-4 text-gray01 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lista
            </Button>
          </Link>
        </div>
        <ProductsForm />
      </div>
    </div>
  );
}
