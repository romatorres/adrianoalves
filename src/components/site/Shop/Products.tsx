"use client";

import { ProductCard } from "./_components/ProductCard";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCardSkeleton } from "@/components/site/Shop/_components/ProductCardSkeleton";

interface ProductGridProps {
  isVisible?: boolean;
}

export function Products({ isVisible = true }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);

        /* const formattedProducts = data.map((product: any) => ({
            ...product,
            price: Number(product.price),
          })); */
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchProducts();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const renderSkeletons = () => (
    <CarouselContent className="-ml-2 md:-ml-4 justify-center">
      {Array.from({ length: 4 }).map((_, index) => (
        <CarouselItem
          key={index}
          className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
        >
          <div className="p-1 h-full">
            <ProductCardSkeleton />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  );

  const renderServices = () => {
    if (!products || products.length === 0) {
      return (
        <div className="text-center text-black-secondary py-10">
          Nenhum serviço disponível no momento.
        </div>
      );
    }
    return (
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="p-1 h-full">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    );
  };

  return (
    <section className="py-10 md:py-16 bg-gray04" id="shop">
      <div className="max-w-[1280px] mx-auto px-2 md:px-6">
        <div className="mb-12 md:mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-primary font-normal text-background mb-3">
            Shops
          </h2>
          <div className="relative w-[96px] h-[22px] md:w-[120px] md:h-[28px]">
            <Image
              src="/img/bigode.svg"
              alt="Bigode abaixo do titulo Loja"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: !isLoading && products.length > 0,
            }}
            plugins={
              !isLoading && products.length > 0
                ? [
                    Autoplay({
                      delay: 2000,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true,
                    }),
                  ]
                : []
            }
          >
            {isLoading ? renderSkeletons() : renderServices()}
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
