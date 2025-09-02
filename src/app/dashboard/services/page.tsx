"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit, Mail, Plus, Trash2, User } from "lucide-react";

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
        toast.success("Usuário excluído com sucesso!");
        // Refetch users
        const fetchedUsers = await getServices();
        setServices(fetchedUsers);
      } else {
        toast.error(result.message || "Erro ao excluir usuário.");
      }
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    });
  };

  const handleUpdateSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedService(null);
    // Refetch users to show updated data
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
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os usuários do sistema
            </p>
          </div>
          <Link
            href={"/dashboard/settings/users/new/"}
            className="md:w-fit w-full"
          >
            <Button className="w-full">
              <span>
                <Plus />
              </span>
              Usuário
            </Button>
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray01">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray04 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray04 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray04 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-amber-100 divide-y divide-gray-300">
              {services.map((service: Service) => (
                <tr
                  key={service.id}
                  className="hover:bg-amber-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray04 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray01" />
                      </div>
                      <div className="text-sm font-medium text-gray01">
                        {service.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray01">
                      {service.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(service)}
                        className="text-background hover:bg-background/10"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(service)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {services.map((service: Service) => (
            <div
              key={service.id}
              className="bg-amber-100 rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray04 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray01" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {service.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray02 mb-3">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{service.description}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(service)}
                  className="flex-1 text-background hover:bg-background/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(service)}
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
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
              Nenhum usuário encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando um novo usuário ao sistema.
            </p>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Faça alterações no perfil do usuário. Clique em salvar para
              aplicar.
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
              Tem certeza que deseja excluir o usuário{" "}
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
