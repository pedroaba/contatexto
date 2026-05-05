import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="TextoTools logo" width={32} height={32} />
              <span className="font-semibold tracking-tight">TextoTools</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Suite de ferramentas de texto rapidas, privadas e profissionais. Tudo
              roda local, no seu navegador.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px]">
              <ShieldCheck className="h-3 w-3 text-success" />
              Privacy-first · Sem rastreio
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 text-sm md:col-span-7">
            <div>
              <div className="font-semibold">Produto</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/#tool"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Ferramenta
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-sky-700 hover:underline underline-offset-2">
                    Sobre
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Recursos</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Documentacao
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs#seo-guide"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Guia SEO
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Empresa</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© 2026 TextoTools — Todos os direitos reservados</span>
          <span>Monetizado com anuncios para manter uso gratuito</span>
        </div>
      </div>
    </footer>
  );
}
