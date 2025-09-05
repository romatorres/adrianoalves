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
import { createTeamMember, updateTeamMember } from "../action";
import { Team } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Unified schema for creating and editing a service
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  bio: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  imageUrl: z.string().url("URL da imagem inválida"),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMemberProps {
  member?: Team | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TeamMemberForm({
  member,
  onSuccess,
  onCancel,
}: TeamMemberProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!member;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      imageUrl: "",
      instagram: "",
      facebook: "",
      linkedin: "",
      active: true,
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        bio: member.bio,
        imageUrl: member.imageUrl,
        instagram: member.instagram,
        facebook: member.facebook,
        linkedin: member.linkedin,
        active: member.active ?? true,
      });
    }
  }, [member, form]);

  async function onSubmit(formData: FormValues) {
    setIsLoading(true);

    const dataToSend = {
      name: formData.name.trim(),
      bio: formData.bio ?? null,
      imageUrl: formData.imageUrl,
      instagram: formData.instagram ?? null,
      facebook: formData.facebook ?? null,
      linkedin: formData.linkedin ?? null,
      active: formData.active,
    };

    try {
      if (isEditMode && member) {
        const result = await updateTeamMember(member.id, dataToSend);
        if (result.success) {
          toast.success("Membro atualizado com sucesso!");
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.message || "Erro ao atualizar o membro do time");
        }
      } else {
        const result = await createTeamMember(dataToSend);
        if (result.success) {
          toast.success("Membro cadastrado com sucesso!");
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.replace("/dashboard/team");
          }
        } else {
          toast.error(result.message || "Erro ao cadastrar um membro do time");
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
      router.replace("/dashboard/team");
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
                  <FormLabel>Nome do Membro</FormLabel>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fale sobre você..."
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
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://instagram.com/seu-usuario"
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/seu-usuario"
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linkedin</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/seu-perfil"
                      {...field}
                      value={field.value || ""}
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
                  "Cadastrar Membro"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
