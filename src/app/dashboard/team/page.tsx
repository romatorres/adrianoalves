"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import { Team } from "@/lib/types";
import { getTeamMember, deleteTeamMember } from "./action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamMemberForm } from "./_components/team-form";

export default function TeamMember() {
  const [members, setTeamMember] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    async function loadMembers() {
      setIsLoading(true);
      const fetchedTeamMember = await getTeamMember();
      setTeamMember(fetchedTeamMember);
      setIsLoading(false);
    }
    loadMembers();
  }, []);

  const handleEditClick = (member: Team) => {
    setSelectedTeam(member);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (member: Team) => {
    setSelectedTeam(member);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTeam) return;

    startTransition(async () => {
      const result = await deleteTeamMember(selectedTeam.id);
      if (result.success) {
        toast.success("Membro excluído com sucesso!");
        // Refetch Team
        const fetchedTeamMember = await getTeamMember();
        setTeamMember(fetchedTeamMember);
      } else {
        toast.error(result.message || "Erro ao excluir o membro do time.");
      }
      setIsDeleteDialogOpen(false);
      setSelectedTeam(null);
    });
  };

  const handleUpdateSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedTeam(null);
    // Refetch team to show updated data
    setIsLoading(true);
    const fetchedTeamMember = await getTeamMember();
    setTeamMember(fetchedTeamMember);
    setIsLoading(false);
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando membros...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os membros do time
            </p>
          </div>
          <Link href={"/dashboard/team/new/"} className="md:w-fit w-full">
            <Button className="w-full">
              <span className="flex items-center justify-center gap-1">
                <Plus />
                Membro
              </span>
            </Button>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center sm:justify-items-start place-items-center sm:place-items-start">
          {members.map((member: Team) => (
            <div
              key={member.id}
              className="bg-amber-100 rounded-lg shadow-sm border border-gray-200 p-3 max-w-80"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="relative aspect-[4/3] w-full mb-4">
                    <Image
                      src={member.imageUrl || "/img/default-service.jpg"}
                      alt={member.name}
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
                        {member.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center text-gray01 font-semibold mb-3">
                      <span className="truncate">{member.instagram}</span>
                    </div>
                    <div className="flex items-center text-gray01 font-semibold mb-3">
                      <span className="truncate">{member.facebook}</span>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray02 mb-3">
                    <span className="">{member.bio}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        member.active
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {member.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(member)}
                  className="text-background hover:bg-background/10"
                >
                  <span className="flex gap-1 items-center">
                    <Edit className="h-4 w-4" />
                    Editar
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(member)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <span className="flex gap-1 items-center">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && members.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum membro cadastrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando um novo membro da sua equipe.
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
          <TeamMemberForm
            member={selectedTeam}
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
              Tem certeza que deseja excluir o Membro do time?{" "}
              <strong>{selectedTeam?.name}</strong>? Esta ação não pode ser
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
