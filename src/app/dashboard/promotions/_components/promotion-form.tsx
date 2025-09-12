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
import { createPromotion, updatePromotion } from "../action";
import { Promotion, PromotionFormData } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Schema using string for dates to avoid timezone issues within the form
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional().nullable(),
  discount: z.number().optional().nullable(),
  imageUrl: z.string().url("URL da imagem inválida").optional().nullable(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface PromotionsProps {
  promotion?: Promotion | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PromotionForm({
  promotion,
  onSuccess,
  onCancel,
}: PromotionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!promotion;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      discount: null,
      active: true,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (promotion) {
      const discountValue =
        typeof promotion.discount === "object" && promotion.discount !== null
          ? promotion.discount.toNumber()
          : promotion.discount;

      reset({
        title: promotion.title,
        description: promotion.description,
        imageUrl: promotion.imageUrl,
        discount: discountValue,
        active: promotion.active ?? true,
      });
    }
  }, [promotion, reset]);

  async function onSubmit(formData: FormValues) {
    setIsLoading(true);

    // Convert date strings back to Date objects in local timezone for submission
    const dataToSend: PromotionFormData = {
      title: formData.title.trim(),
      description: formData.description || null,
      imageUrl: formData.imageUrl || null,
      discount: formData.discount ?? null,
      active: formData.active,
    };

    try {
      if (isEditMode && promotion) {
        const result = await updatePromotion(promotion.id, dataToSend);
        if (result.success) {
          toast.success("Promoção atualizada com sucesso!");
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.message || "Erro ao atualizar promoção");
        }
      } else {
        const result = await createPromotion(dataToSend);
        if (result.success) {
          toast.success("Promoção cadastrada com sucesso!");
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.replace("/dashboard/promotions");
          }
        } else {
          toast.error(result.message || "Erro ao cadastrar uma promoção");
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
      router.replace("/dashboard/promotions");
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
                  <FormLabel>Título da Promoção</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fale sobre a promoção..."
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
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desconto (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? Number(value) : null);
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
                    {isEditMode ? "Salvando..." : "Cadastrar Promoção"}
                  </>
                ) : isEditMode ? (
                  "Salvar Alterações"
                ) : (
                  "Cadastrar Promoção"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
