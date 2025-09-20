import Image from "next/image";
import Link from "next/link";
import { SitePromotion } from "@/lib/types";

interface PromotionCardProps {
  promotion: SitePromotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full flex flex-col h-fit">
      {promotion.imageUrl && (
        <div className="relative w-full aspect-video flex-shrink-0">
          <Image
            src={promotion.imageUrl}
            alt={promotion.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
          <p className="text-gray-01 mb-4">{promotion.description}</p>
        </div>
        <div className="text-sm text-gray-03 mt-4">
          <div className="flex justify-between items-end">
            {promotion.discount && (
              <div className="border border-background rounded-sm px-3 py-1">
                <p className="text-background font-bold text-2xl flex items-center">
                  {promotion.discount}%
                  <span className="text-sm font-semibold ml-1">OFF</span>
                </p>
              </div>
            )}

            <Link
              href="https://wa.me/75988460046?text=Olá!%20Vi%20seu%20site%20e%20gostaria%20de%20mais%20informações."
              target="_blank"
              className="ml-auto"
            >
              <button className="bg-primary hover:bg-amber-300 font-semibold text-background text-sm font-tertiary py-3 px-6 rounded-full transition-colors duration-300 cursor-pointer">
                Consultar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
