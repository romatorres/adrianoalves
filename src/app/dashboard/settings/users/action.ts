export default async function getUsers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/users`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Erro ao buscar usuários");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}
