"use client";

import Image from "next/image";
import Link from "next/link";
import { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(service.price || 0));

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-56 w-full">
        <Image
          src={service.imageUrl || "/img/default-service.jpg"}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-secondary font-semibold text-gray-800">
          {service.name}
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-600 font-tertiary">
          {service.description}
        </p>
        <div className="mt-4">
          <p className="text-xs text-gray-500">Duração</p>
          <p className="font-semibold text-gray-700">
            {service.duration} minutos
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold font-quaternary text-background">
              {formattedPrice}
            </p>
          </div>
          <Link
            href="https://cashbarber.com.br/barbeariaadrianoalves/login"
            target="_blank"
          >
            <button className="rounded-full bg-primary hover:bg-amber-300 py-2.5 px-4 text-sm font-tertiary text-background font-semibold transition-colors duration-300 cursor-pointer">
              Agendar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
