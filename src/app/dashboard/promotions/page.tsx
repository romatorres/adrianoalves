"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import { Promotion } from "@/lib/types";
import { getPromotions, deletePromotion } from "./action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromotionForm } from "./_components/promotion-form";

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );

  useEffect(() => {
    async function loadPromotions() {
      setIsLoading(true);
      const fetchedPromotions = await getPromotions();
      setPromotions(fetchedPromotions);
      setIsLoading(false);
    }
    loadPromotions();
  }, []);

  const handleEditClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedPromotion) return;

    startTransition(async () => {
      const result = await deletePromotion(selectedPromotion.id);
      if (result.success) {
        toast.success("Promoçõ excluída com sucesso!");
        // Refetch services
        const fetchedPromotions = await getPromotions();
        setPromotions(fetchedPromotions);
      } else {
        toast.error(result.message || "Erro ao excluir a promoção.");
      }
      setIsDeleteDialogOpen(false);
      setSelectedPromotion(null);
    });
  };

  const handleUpdateSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedPromotion(null);
    // Refetch promotion to show updated data
    setIsLoading(true);
    const fetchedPromotions = await getPromotions();
    setPromotions(fetchedPromotions);
    setIsLoading(false);
  };

  if (isLoading && promotions.length === 0) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center h-64">
        <p>Carregando promoções...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promoções</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos as promoções do sistema
            </p>
          </div>
          <Link href={"/dashboard/promotions/new/"} className="md:w-fit w-full">
            <Button className="w-full">
              <Plus />
              Promoção
            </Button>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center sm:justify-items-start place-items-center sm:place-items-start">
          {promotions.map((promotion: Promotion) => (
            <div
              key={promotion.id}
              className="bg-amber-100 rounded-lg shadow-sm border border-gray-200 p-3 max-w-120 w-full flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="relative aspect-[4/3] w-full mb-4">
                    <Image
                      src={promotion.imageUrl || "/img/default-service.jpg"}
                      alt={promotion.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex items-center mb-3">
                    <div>
                      <p className="font-semibold text-background text-xl">
                        {promotion.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray02 mb-3">
                    <span className="">{promotion.description}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-price font-semibold text-lg mb-3">
                      <span className="truncate">
                        {typeof promotion.discount === "number"
                          ? `${promotion.discount.toFixed(0)}% OFF`
                          : typeof promotion.discount === "object" &&
                            promotion.discount?.toNumber
                          ? promotion.discount.toNumber().toFixed(2)
                          : "Promoção Especial"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-1 items-center text-gray01 text-sm mb-1">
                        <p>Inicio:</p>
                        <span className="truncate">
                          {promotion.startDate
                            ? new Date(promotion.startDate).toLocaleDateString(
                                "pt-BR"
                              )
                            : "Não definida"}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center text-gray01 text-sm mb-3">
                        <p>Fim:</p>
                        <span className="truncate">
                          {promotion.endDate
                            ? new Date(promotion.endDate).toLocaleDateString(
                                "pt-BR"
                              )
                            : "Não definida"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        promotion.active
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {promotion.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(promotion)}
                  className="text-background hover:bg-background/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(promotion)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && promotions.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma promoção encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando uma nova promoção ao sistema.
            </p>
          </div>
        )}
      </div>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Promoção</DialogTitle>
            <DialogDescription>
              Faça alterações na promoção. Clique em salvar para aplicar.
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            promotion={selectedPromotion}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o serviço{" "}
              <strong>{selectedPromotion?.title}</strong>? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
