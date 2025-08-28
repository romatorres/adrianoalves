import { Button } from "@/components/ui/button";
import { UsersForm } from "./_components/users-form";
import { Plus } from "lucide-react";

export default function Users() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Usuários</h1>
          <Button>
            <span>
              <Plus />
            </span>
            Usuário
          </Button>
        </div>
        <div className="bg-amber-100 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4 md:mt-0 mt-2">
              <Button variant={"ghost"}>Editar</Button>
              <Button variant={"ghost"} className="text-destructive">
                Deletar
              </Button>
            </div>
          </div>
        </div>
        <UsersForm />
      </div>
    </div>
  );
}
