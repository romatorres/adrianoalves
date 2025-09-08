import { GalleryImageForm } from "@/app/dashboard/gallery/_components/gallery-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function newGalleryImage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex md:flex-row flex-col md:items-center items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Foto</h1>
            <p className="text-gray-600 mt-1">
              Preencha as informações para criar uma nova foto.
            </p>
          </div>
          <div>
            <Link href="/dashboard/gallery">
              <Button
                variant="ghost"
                className="mb-4 text-gray01 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Lista
              </Button>
            </Link>
          </div>
        </div>
        <GalleryImageForm />
      </div>
    </div>
  );
}
