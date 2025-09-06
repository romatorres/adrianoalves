"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type SectionsMap = Record<string, boolean>;

const SectionContext = createContext<SectionsMap | null>(null);

export const useSectionData = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSectionData must be used within a SectionDataProvider");
  }
  return context;
};

interface SectionDataProviderProps {
  children: ReactNode;
}

export function SectionDataProvider({ children }: SectionDataProviderProps) {
  const [sectionsMap, setSectionsMap] = useState<SectionsMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/sections`,
          { cache: "no-store" }
        );
        const sections = await sectionsResponse.json();

        const newSectionsMap = sections.reduce(
          (
            acc: SectionsMap,
            section: { name: string; active: boolean }
          ) => {
            acc[section.name] = section.active;
            return acc;
          },
          {} as SectionsMap
        );
        setSectionsMap(newSectionsMap);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (isLoading) {
    return null; 
  }

  return (
    <SectionContext.Provider value={sectionsMap}>
      {children}
    </SectionContext.Provider>
  );
}