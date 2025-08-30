import { Button } from "@/components/ui/button";
import { Edit, Mail, Plus, Trash2, User } from "lucide-react";
import { getUsers } from "./action";
import { UserType } from "@/lib/types";
import Link from "next/link";

export default async function Users() {
  const users = await getUsers();

  /* const handleEdit = (userId: string) => {
    // Implementar lógica de edição
    console.log("Editando usuário:", userId);
  };

  const handleDelete = (userId: string) => {
    // Implementar lógica de exclusão
    console.log("Excluindo usuário:", userId);
  }; */

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

        {/* Desktop Table - Hidden on mobile */}
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
                        /* onClick={() => handleEdit(user.id)} */
                        className="text-background hover:bg-background/10"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        /* onClick={() => handleDelete(user.id)} */
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

        {/* Mobile Cards - Visivel somente mobile */}
        <div className="md:hidden space-y-3">
          {users.map((user: UserType) => (
            <div
              key={user.id}
              className="bg-amber-100 rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Nome */}
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

                  {/* Email */}
                  <div className="flex items-center text-sm text-gray02 mb-3">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  /* onClick={() => handleEdit(user.id)} */
                  className="flex-1 text-background hover:bg-background/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  /* onClick={() => handleDelete(user.id)} */
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vazio */}
        {users.length === 0 && (
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
    </div>
  );
}
