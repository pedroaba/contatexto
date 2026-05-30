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
              <Image src="/logo.png" alt="ContaTexto logo" width={32} height={32} />
              <span className="font-semibold tracking-tight">ContaTexto</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Suíte de ferramentas de texto rápidas, privadas e profissionais. Tudo
              roda local, no seu navegador.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px]">
              <ShieldCheck className="h-3 w-3 text-success" />
              Privacidade e transparência
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
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contador-de-caracteres"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Caracteres
                  </Link>
                </li>
                <li>
                  <Link
                    href="/meta-title-meta-description"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    SEO
                  </Link>
                </li>
                <li>
                  <Link
                    href="/revisao-de-textos"
                    className="hover:text-sky-700 hover:underline underline-offset-2"
                  >
                    Revisão
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
          <span>© 2026 ContaTexto — Todos os direitos reservados</span>
          <span>Ferramenta gratuita com foco em privacidade</span>
        </div>
      </div>
    </footer>
  );
}
