"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Home,
  ImageIcon,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  UserCog,
  LogOut,
  Scissors,
  LucideIcon,
  LayoutTemplate,
} from "lucide-react";
// Removido: import router from "next/router";

interface SubMenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Serviços", href: "/dashboard/services", icon: Scissors },
  { name: "Produtos", href: "/dashboard/products", icon: ShoppingBag },
  { name: "Galeria", href: "/dashboard/gallery", icon: ImageIcon },
  { name: "Equipe", href: "/dashboard/team", icon: Users },
  { name: "Promoções", href: "/dashboard/promotions", icon: Tag },
  {
    name: "Gerenciar Seções",
    href: "/dashboard/sections",
    icon: LayoutTemplate,
  },
  {
    name: "Configurações",
    icon: Settings,
    subItems: [
      {
        name: "Usuários",
        href: "/dashboard/settings/users",
        icon: UserCog,
      },
    ],
  },
];

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter(); // Corrigido: usando useRouter do next/navigation

  const { data: session } = authClient.useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-background"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col px-3 py-0 overflow-y-auto bg-amber-100 border-r w-64">
          {/* Perfil do usuário */}
          <div className="mb-6 p-4 border-b border-gray01 flex justify-end md:justify-start ">
            <div className="flex flex-row items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray01 flex items-center justify-center">
                <span className="text-xl font-medium text-white">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-background truncate">
                  {session?.user?.name || "Usuário"}
                </p>
                <p className="text-xs text-gray01 truncate">Admin</p>
              </div>
            </div>
          </div>

          {/* Menu principal */}
          <ul className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const isActive = item.href ? pathname === item.href : false;
              const hasSubmenu = "subItems" in item;
              const isSubmenuOpen = openSubmenu === item.name;

              return (
                <li key={item.name}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray04 text-gray-01`}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-6 h-6 mr-2" />
                          <span>{item.name}</span>
                        </div>
                        {isSubmenuOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {isSubmenuOpen && item.subItems && (
                        <ul className="ml-6 mt-2 space-y-2">
                          {item.subItems.map((subItem) => {
                            const isSubItemActive = pathname === subItem.href;
                            return (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center p-2 rounded-lg hover:bg-gray04 ${
                                    isSubItemActive
                                      ? "bg-gray04 text-background"
                                      : "text-gray-01"
                                  }`}
                                  onClick={() => setIsSidebarOpen(false)}
                                >
                                  <subItem.icon className="w-5 h-5 mr-2" />
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`flex items-center p-2 rounded-lg hover:bg-gray04 ${
                        isActive
                          ? "bg-amber-100 text-background"
                          : "text-gray-01"
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon className="w-6 h-6 mr-2" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Botão de logout */}
          <div className="border-t border-gray01 py-4 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-6 h-6 mr-2" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
