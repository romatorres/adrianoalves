"use client";

import { ServiceCard } from "./_components/ServiceCard";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Service } from "@/lib/types";
import { useEffect, useState } from "react";
import { ServiceCardSkeleton } from "./_components/ServiceCardSkeleton";

interface ServiceGridProps {
  isVisible?: boolean;
}

export function Services({ isVisible = true }: ServiceGridProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchServices();
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
            <ServiceCardSkeleton />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  );

  const renderServices = () => {
    if (!services || services.length === 0) {
      return (
        <div className="text-center text-black-secondary py-10">
          Nenhum serviço disponível no momento.
        </div>
      );
    }

    return (
      <CarouselContent className="-ml-2 md:-ml-4">
        {services.map((service) => (
          <CarouselItem
            key={service.id}
            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="p-1 h-full">
              <ServiceCard service={service} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    );
  };

  return (
    <section className="py-10 md:py-16 bg-secondary" id="service">
      <div className="max-w-[1280px] mx-auto px-2 md:px-6">
        <div className="mb-8 md:mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-primary font-normal text-black-secondary mb-3">
            Serviços
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

        <div className="flex justify-center">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: !isLoading && services.length > 0, // Disable loop when loading or empty
            }}
            plugins={
              !isLoading && services.length > 0
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
