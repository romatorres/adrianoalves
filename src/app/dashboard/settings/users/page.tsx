import { UsersForm } from "./_components/users-form";

export default function Users() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Cadastro</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie um novo usuário para a sua aplicação!
          </p>
        </div>
        <UsersForm />
      </div>
    </div>
  );
}
