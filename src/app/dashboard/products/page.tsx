"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { getProducts, deleteProducts } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductsForm } from "./_components/products-form";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedProduct) return;

    startTransition(async () => {
      const result = await deleteProducts(selectedProduct.id);
      if (result.success) {
        toast.success("Produto excluído com sucesso!");
        // Refetch products
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } else {
        toast.error(result.message || "Erro ao excluir o produto.");
      }
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    });
  };

  const handleUpdateSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    // Refetch product to show updated data
    setIsLoading(true);
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
    setIsLoading(false);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center h-64">
        <p>Carregando produtos...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-8">
        <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os produtos do sistema
            </p>
          </div>
          <Link href={"/dashboard/products/new/"} className="md:w-fit w-full">
            <Button className="w-full">
              <Plus />
              Produtos
            </Button>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center sm:justify-items-start place-items-center sm:place-items-start">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-amber-100 rounded-lg shadow-sm border border-gray-200 p-3 max-w-120 w-full flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="relative aspect-[4/3] w-full mb-4">
                    <Image
                      src={product.imageUrl || "/img/default-service.jpg"}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex items-center mb-3">
                    <div>
                      <p className="font-semibold text-background text-xl">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray02 mb-3">
                    <span className="">{product.description}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        product.active
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(product)}
                  className="text-background hover:bg-background/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(product)}
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
        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum produto encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando um novo produto ao sistema.
            </p>
          </div>
        )}
      </div>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça alterações no produto. Clique em salvar para aplicar.
            </DialogDescription>
          </DialogHeader>
          <ProductsForm
            product={selectedProduct}
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
              Tem certeza que deseja excluir o produto{" "}
              <strong>{selectedProduct?.name}</strong>? Esta ação não pode ser
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
