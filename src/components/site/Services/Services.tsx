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

interface ServiceGridProps {
  services: Service[];
  isVisible?: boolean;
}

export function Services({ services = [], isVisible = true }: ServiceGridProps) {
  if (!isVisible) return null;

  if (!services || services.length === 0) {
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
          <div className="text-center text-black-secondary py-10">
            Nenhum serviço disponível no momento.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16 bg-secondary">
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
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
          >
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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
