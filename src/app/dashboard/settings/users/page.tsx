"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit, Mail, Plus, Trash2, User } from "lucide-react";

import { UserType } from "@/lib/types";
import { getUsers, deleteUser } from "./action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UsersForm } from "./_components/users-form";

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      setIsLoading(false);
    }
    loadUsers();
  }, []);

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        toast.success("Usuário excluído com sucesso!");
        // Refetch users
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } else {
        toast.error(result.message || "Erro ao excluir usuário.");
      }
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    });
  };

  const handleUpdateSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    // Refetch users to show updated data
    setIsLoading(true);
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
    setIsLoading(false);
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando usuários...</p>
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
              {users.map((user: UserType) => (
                <tr
                  key={user.id}
                  className="hover:bg-amber-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray04 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray01" />
                      </div>
                      <div className="text-sm font-medium text-gray01">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray01">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                        className="text-background hover:bg-background/10"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
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
          {users.map((user: UserType) => (
            <div
              key={user.id}
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
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray02 mb-3">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(user)}
                  className="flex-1 text-background hover:bg-background/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(user)}
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
        {!isLoading && users.length === 0 && (
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
          <UsersForm
            user={selectedUser}
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
              <strong>{selectedUser?.name}</strong>? Esta ação não pode ser
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
