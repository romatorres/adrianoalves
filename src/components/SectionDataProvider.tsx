import { ReactNode } from 'react';

interface SectionDataProviderProps {
  children: (sectionsMap: Record<string, boolean>) => ReactNode;
}

export async function SectionDataProvider({ children }: SectionDataProviderProps) {
  const sectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sections`, { cache: 'no-store' });
  const sections = await sectionsResponse.json();

  const sectionsMap = sections.reduce(
    (acc: Record<string, boolean>, section: { name: string; active: boolean }) => {
      acc[section.name] = section.active;
      return acc;
    },
    {} as Record<string, boolean>
  );

  return <>{children(sectionsMap)}</>;
}
