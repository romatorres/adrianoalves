"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSections, updateSectionStatus } from "./action";

interface Section {
  id: string;
  name: string;
  active: boolean;
}

const sectionNames = {
  gallery: "Galeria",
  products: "Produtos",
  promotions: "Promoções",
  services: "Serviços",
  team: "Equipe",
};

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const result = await getSections();

        if (result && "error" in result) {
          console.error("Error from action:", result.error);
          setSections([]);
        } else if (Array.isArray(result)) {
          setSections(result);
        } else {
          console.error("Unexpected data format:", result);
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSections();
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    const originalSections = sections;

    // Optimistic update
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, active } : section
      )
    );

    const result = await updateSectionStatus(id, active);

    if (result?.error) {
      console.error("Error updating section:", result.error);
      setSections(originalSections);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-background font-bold">Gerenciar Seções</h1>
        <Button variant={"ghost"}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <ChevronLeft />
            <span>Voltar</span>
          </Link>
        </Button>
      </div>
      <div className="bg-amber-100 rounded-lg shadow p-6">
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <span className="text-lg text-gray-01">
                  {sectionNames[section.name as keyof typeof sectionNames]}
                </span>
              </div>
              <div className="flex items-center gap-8">
                <span
                  className={`ml-3 text-sm px-2 py-1 rounded ${
                    section.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {section.active ? "Habilitado" : "Desabilitado"}
                </span>
                <Switch
                  checked={section.active}
                  onCheckedChange={(active) => handleToggle(section.id, active)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
