import { SitePromotion } from "@/lib/types";
import { PromotionCard } from "./_components/PromotionCard";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PromotionGridProps {
  isVisible?: boolean;
}

export function Promotions({ isVisible = true }: PromotionGridProps) {
  const [promotion, setPromotion] = useState<SitePromotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/promotions");
        const data = await res.json();
        const activePromotions = data.filter((p: SitePromotion) => p.active);
        setPromotion(activePromotions);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    if (isVisible) {
      fetchPromotions();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  // Se não houver promoções, mostrar mensagem
  if (promotion.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-secondary bg-cover bg-center bg-no-repeat">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="mb-16 md:mb-20 flex flex-col items-center">
            <h2 className="text-3xl md:text-6xl font-primary font-normal text-black-secondary mb-3">
              Promoções
            </h2>
            <div className="relative w-[96px] h-[22px] md:w-[120px] md:h-[28px]">
              <Image
                src="/img/bigode.svg"
                alt="Bigode abaixo do titulo Serviços"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Nenhuma promoção cadastrada no momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-secondary bg-cover bg-center bg-no-repeat">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="mb-16 md:mb-20 flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-primary font-normal text-background mb-3">
            Promoções
          </h2>
          <div className="relative w-[96px] h-[22px] md:w-[120px] md:h-[28px]">
            <Image
              src="/img/bigode.svg"
              alt="Bigode abaixo do titulo Serviços"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div
          className={`grid gap-6 ${
            promotion.length === 1
              ? "grid-cols-1 justify-items-center [&>*]:max-w-[50%]"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {promotion.slice(0, 2).map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
