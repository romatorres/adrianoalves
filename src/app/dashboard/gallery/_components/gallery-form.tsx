"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createGalleryImage, updateGalleryImage } from "../action";
import { GalleryImage } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Unified schema for creating and editing a service
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional().nullable(),
  featured: z.boolean(),
  imageUrl: z.string().url("URL da imagem inválida"),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface GalleryImageProps {
  gallery?: GalleryImage | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function GalleryImageForm({
  gallery,
  onSuccess,
  onCancel,
}: GalleryImageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!gallery;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      featured: false,
      active: true,
    },
  });

  useEffect(() => {
    if (gallery) {
      form.reset({
        title: gallery.title,
        description: gallery.description,
        imageUrl: gallery.imageUrl,
        featured: gallery.featured ?? false,
        active: gallery.active ?? true,
      });
    }
  }, [gallery, form]);

  async function onSubmit(formData: FormValues) {
    setIsLoading(true);

    const dataToSend = {
      title: formData.title.trim(),
      description: formData.description ?? null,
      imageUrl: formData.imageUrl,
      featured: formData.featured,
      active: formData.active,
    };

    try {
      if (isEditMode && gallery) {
        const result = await updateGalleryImage(gallery.id, dataToSend);
        if (result.success) {
          toast.success("Foto atualizada com sucesso!");
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.message || "Erro ao atualizar galeria");
        }
      } else {
        const result = await createGalleryImage(dataToSend);
        if (result.success) {
          toast.success("Foto cadastrada com sucesso!");
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.replace("/dashboard/gallery");
          }
        } else {
          toast.error(result.message || "Erro ao cadastrar uma galeria");
        }
      }
    } catch {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.replace("/dashboard/gallery");
    }
  };

  return (
    <div
      className={
        !isEditMode ? "bg-amber-100 shadow overflow-hidden sm:rounded-md" : ""
      }
    >
      <div className={!isEditMode ? "px-4 py-4 sm:px-6" : "pt-4"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Foto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Carlos Santos"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fale sobre a foto..."
                      {...field}
                      value={field.value ?? ""} // Handle null value
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com/imagem.png"
                      {...field}
                      value={field.value ?? ""} // Handle null value
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray03 p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray03 p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Destaque</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center md:justify-end justify-center space-x-4 pt-6">
              <Button
                type="button"
                variant={"secondary"}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>

              <Button type="submit" variant={"default"} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Salvando..." : "Cadastrando..."}
                  </>
                ) : isEditMode ? (
                  "Salvar Alterações"
                ) : (
                  "Cadastrar Foto"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
