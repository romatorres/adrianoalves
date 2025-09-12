import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-6">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <a href="#home">
            <Image
              src="/img/logo.png"
              alt="Logomarca"
              width={128}
              height={60}
            />
          </a>
          <div className="text-center text-sm md:text-base text-gray04">
            © {currentYear} Adriano Alves. Todos os direitos reservados.
          </div>
          <a
            href="https://romatorres.dev.br"
            target="_blank"
            className="hover:-translate-x-0.5 duration-300"
          >
            <Image
              src="/img/logo-roma.svg"
              alt="Logo Parceiro"
              width={28}
              height={28}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
