"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserType } from "@/lib/types";

// Schema for creating a user
const createSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, {
      message: "A confirmação de senha deve ter pelo menos 8 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema for editing a user
const editSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "A nova senha deve ter pelo menos 8 caracteres" })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

interface UsersFormProps {
  user?: UserType | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UsersForm({ user, onSuccess, onCancel }: UsersFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!user;

  const formSchema = isEditMode ? editSchema : createSchema;
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  async function onSubmit(formData: FormValues) {
    setIsLoading(true);

    if (isEditMode && user) {
      // Update user
      const updateData: { name: string; email: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      try {
        const res = await fetch(`/api/auth/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Erro ao atualizar usuário");
        }

        toast.success("Usuário atualizado com sucesso!");
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        toast.error(error.message || "Ocorreu um erro inesperado.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Create user
      await authClient.signUp.email(
        {
          name: formData.name,
          email: formData.email,
          password: (formData as z.infer<typeof createSchema>).password,
        },
        {
          onSuccess: () => {
            toast.success("Usuário cadastrado com sucesso!");
            form.reset();
            if (onSuccess) {
              onSuccess();
            } else {
              router.replace("/dashboard/settings/users");
            }
          },
          onError: (ctx) => {
            const errorMessage =
              ctx.error.message || "Erro ao cadastrar usuário";
            toast.error(errorMessage);
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.replace("/dashboard/settings/users");
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
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome completo"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      type="email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditMode ? "Nova Senha (opcional)" : "Senha"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isEditMode ? form.watch("password") : true) && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isEditMode ? "Confirmar Nova Senha" : "Confirmar Senha"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                  "Cadastrar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
