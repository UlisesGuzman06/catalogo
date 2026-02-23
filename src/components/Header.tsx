import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="gov-header">
      <div className="gov-container h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-[60px] h-[60px] md:w-[70px] md:h-[70px]">
            <Image
              src="/logo.png"
              alt="Logo Institucional"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="h-8 w-px bg-blue-400 mx-2 hidden sm:block"></div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Catálogo de Servicios
          </h1>
        </div>
      </div>
    </header>
  );
}
