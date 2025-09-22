"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Image from "next/image";

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
import { createProducts, updateProducts } from "../actions";
import { Product } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UploadDropzone } from "@/components/ui/upload-button";
import { deleteFile } from "@/lib/uploadthing-actions";

// Schema using string for dates to avoid timezone issues within the form
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  price: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("URL da imagem inválida").optional().nullable(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductsProps {
  product?: Product | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductsForm({ product, onSuccess, onCancel }: ProductsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!product;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: null,
      imageUrl: "",
      active: true,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (product) {
      const priceValue = product.price ? Number(product.price) : null;

      reset({
        name: product.name,
        description: product.description,
        price: priceValue,
        imageUrl: product.imageUrl,
        active: product.active ?? true,
      });
    }
  }, [product, reset]);

  async function onSubmit(formData: FormValues) {
    setIsLoading(true);

    // Convert date strings back to Date objects in local timezone for submission
    const dataToSend: Product = {
      name: formData.name.trim(),
      description: formData.description ?? "",
      imageUrl: formData.imageUrl ?? "",
      active: formData.active,
      id: "",
      price: formData.price ?? 0,
    };

    try {
      if (isEditMode && product) {
        const result = await updateProducts(product.id, dataToSend);
        if (result.success) {
          toast.success("Produto atualizado com sucesso!");
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.message || "Erro ao atualizar o produto");
        }
      } else {
        const result = await createProducts(dataToSend);
        if (result.success) {
          toast.success("Produto cadastrado com sucesso!");
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.replace("/dashboard/products");
          }
        } else {
          toast.error(result.message || "Erro ao cadastrar um produto");
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
      router.replace("/dashboard/products");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Produto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Desconto de Verão"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 29.90"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : Number(value));
                      }}
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
                      placeholder="Fale sobre o produto..."
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
                  <FormLabel>Imagem do Produto</FormLabel>
                  <FormControl>
                    <div className="min-h-[40px]">
                      {field.value ? (
                        <div className="relative mt-2 w-fit">
                          <Image
                            src={field.value}
                            alt="Imagem da promoção"
                            width={200}
                            height={200}
                            className="rounded-md object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={async () => {
                              if (field.value) {
                                const fileKey = field.value.substring(
                                  field.value.lastIndexOf("/") + 1
                                );
                                const result = await deleteFile(fileKey);
                                if (result.success) {
                                  toast.success("Imagem removida com sucesso!");
                                  field.onChange("");
                                } else {
                                  toast.error("Erro ao remover a imagem.");
                                }
                              }
                            }}
                            disabled={isLoading}
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          appearance={{
                            button: "bg-gray03 p-3 rounded-md",
                            container:
                              "w-full border border-dashed border-gray-400 hover:bg-white cursor-pointer",
                          }}
                          onClientUploadComplete={(res) => {
                            if (res && res.length > 0) {
                              field.onChange(res[0].url);
                              toast.success("Upload concluído!");
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Falha no upload: ${error.message}`);
                          }}
                        />
                      )}
                    </div>
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
                    {isEditMode ? "Salvando..." : "Cadastrar Produto"}
                  </>
                ) : isEditMode ? (
                  "Salvar Alterações"
                ) : (
                  "Cadastrar Produto"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
