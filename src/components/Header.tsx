import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="gov-header">
      <div className="gov-container h-16 flex items-center justify-between p-10">
        <div className="flex items-center gap-4">
          <div className="relative w-[60px] h-[60px] ">
            <Image
              src="/gob_escudo_footer.png"
              alt="Gobierno de Mendoza"
              fill
              className="object-contain"
              priority
              sizes="60px"
            />
          </div>
          <div className="h-8 w-px bg-white/30 mx-2 hidden sm:block"></div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-white">
            Catálogo de Servicios
          </h1>
        </div>
      </div>
    </header>
  );
}
