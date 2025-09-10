import { Promotion, SitePromotion } from "@/lib/types";
import { PromotionCard } from "./_components/PromotionCard";
import Image from "next/image";

interface PromotionGridProps {
  promotions: Promotion[];
  isVisible?: boolean;
}

// Função para converter Promotion para SitePromotion
const convertToSitePromotion = (promotion: Promotion): SitePromotion => {
  // Converter discount se for um objeto Decimal
  const discountValue =
    typeof promotion.discount === "object" &&
    promotion.discount !== null &&
    "toNumber" in promotion.discount
      ? promotion.discount.toNumber()
      : promotion.discount;

  return {
    id: promotion.id,
    title: promotion.title,
    description: promotion.description,
    imageUrl: promotion.imageUrl,
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    discount: discountValue,
  };
};

export function Promotions({
  promotions,
  isVisible = true,
}: PromotionGridProps) {
  if (!isVisible) return null;

  // Converter as promoções para o formato do site
  const sitePromotions: SitePromotion[] = promotions.map(
    convertToSitePromotion
  );

  // Se não houver promoções, mostrar mensagem
  if (sitePromotions.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-service bg-cover bg-center bg-no-repeat">
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
    <section className="py-12 md:py-16 bg-service bg-cover bg-center bg-no-repeat">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sitePromotions.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
