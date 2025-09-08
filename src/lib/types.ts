export interface UserType {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | { toNumber: () => number };
  imageUrl: string | null;
  duration: number;
  active: boolean | undefined;
}

export interface Team {
  id: string;
  name: string;
  imageUrl: string;
  bio?: string | null;
  instagram?: string | null;
  active: boolean;
  facebook?: string | null;
  linkedin?: string | null;
}

export interface TeamMemberProps {
  member: Team;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: Date;
  endDate: Date;
  discount: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  featured: boolean;
  active: boolean;
}

export interface GalleryGridProps {
  images: GalleryImage[];
  isVisible?: boolean;
}

export interface GalleryCardProps {
  image: GalleryImage;
  isLoaded: boolean;
  onLoad: (imageId: string) => void;
  onClick: () => void;
}
