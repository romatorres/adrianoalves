import Link from "next/link";

export default async function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-background">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/dashboard/services">
          <div className="bg-amber-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray01">Serviços</h2>
            <p className="text-3xl font-bold text-background mt-2">Serviços</p>
          </div>
        </Link>
        <Link href="/dashboard/products">
          <div className="bg-amber-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray01">Produtos</h2>
            <p className="text-3xl font-bold text-background mt-2">Produtos</p>
          </div>
        </Link>
        <Link href="/dashboard/gallery">
          <div className="bg-amber-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray01">
              Fotos na Galeria
            </h2>
            <p className="text-3xl font-bold text-background mt-2">Galeria</p>
          </div>
        </Link>
        <Link href="/dashboard/team">
          <div className="bg-amber-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray01">Equipe</h2>
            <p className="text-3xl font-bold text-background mt-2">Time</p>
          </div>
        </Link>
        <Link href="/dashboard/promotions">
          <div className="bg-amber-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray01">
              Promoções Ativas
            </h2>
            <p className="text-3xl font-bold text-background mt-2">Promoção</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
