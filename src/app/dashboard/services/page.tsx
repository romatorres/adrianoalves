"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Clock, DollarSign, Edit, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import { Service } from "@/lib/types";
import { getServices, deleteService } from "./action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServicesForm } from "./_components/service-form";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      const fetchedServices = await getServices();
      setServices(fetchedServices);
      setIsLoading(false);
    }
    loadServices();
  }, []);

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedService) return;

    startTransition(async () => {
      const result = await deleteService(selectedService.id);
      if (result.success) {
        toast.success("Serviço excluído com sucesso!");
        // Refetch services
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } else {
        toast.error(result.message || "Erro ao excluir serviço.");
      }
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    });
  };

  const handleUpdateSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedService(null);
    // Refetch services to show updated data
    setIsLoading(true);
    const fetchedServices = await getServices();
    setServices(fetchedServices);
    setIsLoading(false);
  };

  if (isLoading && services.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os serviços do sistema
            </p>
          </div>
          <Link href={"/dashboard/services/new/"} className="md:w-fit w-full">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid justify-center items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service: Service) => (
            <div
              key={service.id}
              className="bg-amber-100 rounded-lg shadow-sm border border-gray-200 p-3 max-w-80"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="relative aspect-[4/3] w-full mb-4">
                    <Image
                      src={service.imageUrl || "/img/default-service.jpg"}
                      alt={service.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray04 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray01" />
                    </div>
                    <div>
                      <p className="font-semibold text-background">
                        {service.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center text-gray01 font-semibold mb-3">
                      <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {typeof service.price === "number"
                          ? service.price.toFixed(2)
                          : Number(service.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray01 font-semibold mb-3">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{service.duration}min</span>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray02 mb-3">
                    <span className="">{service.description}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        service.active
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {service.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(service)}
                  className="text-background hover:bg-background/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(service)}
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
        {!isLoading && services.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum serviço encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando um novo serviço ao sistema.
            </p>
          </div>
        )}
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Faça alterações no serviço. Clique em salvar para aplicar.
            </DialogDescription>
          </DialogHeader>
          <ServicesForm
            service={selectedService}
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
              <strong>{selectedService?.name}</strong>? Esta ação não pode ser
              desfeita.
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
