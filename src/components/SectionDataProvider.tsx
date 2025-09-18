"use client";

import { createContext, useContext, ReactNode } from "react";

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
  initialData: SectionsMap;
}

export function SectionDataProvider({
  children,
  initialData,
}: SectionDataProviderProps) {
  return (
    <SectionContext.Provider value={initialData}>
      {children}
    </SectionContext.Provider>
  );
}