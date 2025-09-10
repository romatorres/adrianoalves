import Image from "next/image";
import Link from "next/link";
import { SitePromotion } from "@/lib/types";

interface PromotionCardProps {
  promotion: SitePromotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {promotion.imageUrl && (
        <div className="relative w-full aspect-square">
          <Image
            src={promotion.imageUrl}
            alt={promotion.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
        <p className="text-gray-01 mb-4">{promotion.description}</p>
        <div className="text-sm text-gray-03">
          <div className="flex justify-between items-center mt-6">
            {promotion.discount && (
              <div className="bg-background rounded-lg px-3 py-1">
                <p className="text-primary font-bold text-2xl flex items-center">
                  {promotion.discount}%
                  <span className="text-sm font-semibold ml-1">OFF</span>
                </p>
              </div>
            )}
            <Link href="https://wa.me/75988460046" target="_blank">
              <button className="bg-primary hover:bg-black_secondary font-medium text-background hover:text-white text-sm py-3 px-6 rounded-full transition-colors duration-300">
                Consultar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
