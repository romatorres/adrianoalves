"use client";

import { Team as TeamMemberType } from "@/lib/types";
import Image from "next/image";
import TeamMember from "./_components/TeamCard";
import { useEffect, useState } from "react";
import { TeamCardSkeleton } from "./_components/TeamCardSkeleton";

interface TeamGridProps {
  isVisible?: boolean;
}

export default function Team({ isVisible = true }: TeamGridProps) {
  const [members, setMembers] = useState<TeamMemberType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/team");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchTeam();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const activeMembers = members.filter((member) => member.active);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <TeamCardSkeleton key={index} />
      ))}
    </div>
  );

  const renderTeam = () => {
    if (activeMembers.length === 0) {
      return (
        <div className="text-center text-gray-600 py-10">
          Nenhum membro da equipe encontrado.
        </div>
      );
    }

    const getGridCols = (count: number) => {
      if (count === 1)
        return "grid-cols-1 justify-items-center max-w-sm mx-auto";
      if (count === 2)
        return "grid-cols-1 md:grid-cols-2 justify-items-center max-w-2xl mx-auto";
      if (count === 3)
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-4xl mx-auto";
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center max-w-6xl mx-auto";
    };

    return (
      <div className={`grid ${getGridCols(activeMembers.length)} gap-4`}>
        {activeMembers.map((member) => (
          <TeamMember key={member.id} member={member} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="mb-16 md:mb-20 flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-primary font-normal text-background mb-3">
            Nosso Time
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
        <p className="text-lg md:text-xl text-background font-tertiary md:font-semibold font-medium text-center max-w-2xl mx-auto mb-8 md:mb-20">
          Conheça nossa equipe de profissionais altamente qualificados, prontos
          para oferecer o melhor em serviços de barbearia, manicure e salão de
          beleza, unisex.
        </p>
        {isLoading ? renderSkeletons() : renderTeam()}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:space-x-6 mt-16">
          <a
            href="https://cashbarber.com.br/barbeariaadrianoalves/login"
            target="_blank"
            className=" bg-background text-secondary px-12 py-4 rounded-full font-semibold text-center hover:bg-primary hover:text-background transition-colors duration-300"
          >
            AGENDE UM HORÁRIO
          </a>
          <a
            href="#service"
            className="border-2 border-background text-background px-12 py-4 rounded-full font-semibold text-center hover:bg-background hover:text-white transition-colors duration-300"
          >
            NOSSOS SERVIÇOS
          </a>
        </div>
      </div>
    </section>
  );
}
