"use client";

import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price as number);

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-[300px]">
      <div className="rounded-3xl shadow-md overflow-hidden flex flex-col min-h-[460px] sm:min-h-[480px] transition-transform duration-300 ease-in-out hover:translate-y-[-5px] bg-secondary">
        <div className="relative min-h-[260px] w-full p-2">
          <div className="relative w-full h-full min-h-[240px]">
            <Image
              src={product.imageUrl || ""}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 160px, 200px"
              style={{ objectFit: "cover" }}
              className="rounded-2xl"
            />
          </div>
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <div className="text-xl sm:text-2xl font-bold text-background mb-2 line-clamp-2 font-secondary">
            {product.name}
          </div>
          <p className="text-gray01 font-medium font-tertiary">
            {product.description}
          </p>

          <span className="inline-block text-3xl font-bold text-background font-secondary py-4">
            {formattedPrice}
          </span>

          <div className="flex flex-col gap-2 mt-auto">
            <Link
              href="https://wa.me/75988460046?text=Olá!%20Vi%20seu%20site%20e%20gostaria%20de%20mais%20informações."
              target="_blank"
              className="w-full bg-primary text-foreground py-2.5 sm:py-3 px-3 sm:px-4 rounded-full hover:bg-primary-hover border-primary border-[1px] flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transition-colors duration-300"
            >
              <ShoppingCart size={20} />
              <span className="text-lg font-tertiary">Comprar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
