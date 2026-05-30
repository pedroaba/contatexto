"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { ModeToggle } from "@/components/toggle-mode";
import { cn } from "@/lib/utils";

const guidePaths = [
  "/contador-de-caracteres",
  "/contador-de-palavras",
  "/meta-title-meta-description",
  "/tempo-de-leitura",
  "/legendas-redes-sociais",
  "/revisao-de-textos",
];

const navItems = [
  { href: "/#tool", label: "Ferramenta", match: "/" },
  { href: "/docs", label: "Documentação", match: "/docs" },
  { href: "/docs#guias", label: "Guias", match: "guides" },
  { href: "/about", label: "Sobre", match: "/about" },
];

export function ProductBarClient() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ContaTexto logo" width={28} height={28} />
          <span className="text-sm font-semibold tracking-tight">ContaTexto</span>
        </Link>

        <nav
          aria-label="Links principais"
          className="hidden items-center gap-1.5 rounded-full border border-border/80 bg-card/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm md:flex"
        >
          {navItems.map((item) => {
            const isActive =
              item.match === "/"
                ? pathname === "/"
                : item.match === "guides"
                  ? guidePaths.includes(pathname)
                : pathname.startsWith(item.match);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#tool"
            className="shadow-soft inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            <Sparkles className="h-3.5 w-3.5" /> Usar ferramenta
          </Link>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
