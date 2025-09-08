"use client";

import Image from "next/image";
import { GalleryCardProps } from "@/lib/types";

export function GalleryCard({ image, onLoad, onClick }: GalleryCardProps) {
  return (
    <div
      className="group relative h-[390px] cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
      onClick={onClick}
    >
      <Image
        src={image.imageUrl || "/img/default-gallery.jpg"}
        alt={image.title || "Imagem da galeria"}
        fill
        className="rounded-lg object-cover"
        onLoad={() => onLoad(image.id)}
      />
      {image.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 opacity-0 translate-y-4 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          <h3 className="text-lg font-semibold text-white">{image.title}</h3>
          {image.description && (
            <p className="text-sm text-gray-200">{image.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
