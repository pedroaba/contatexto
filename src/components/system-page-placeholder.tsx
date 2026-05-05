import Link from "next/link";

interface SystemPagePlaceholderProps {
  title: string;
  path: string;
}

export function SystemPagePlaceholder({
  title,
  path,
}: SystemPagePlaceholderProps) {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <div className="w-full max-w-3xl rounded-[1.75rem] border border-white/10 bg-[#1a1a1a] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-white/55">Pagina principal do sistema</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Esta e uma tela-base para visualizar a estrutura de navegacao.
          </p>
        </div>

        <div className="space-y-4 px-6 py-6 sm:px-8">
          <div className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <span className="block text-sm text-white/50">Rota</span>
            <span className="mt-1 block text-sm font-medium text-white">{path}</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <span className="block text-sm text-white/50">Acesso</span>
            <Link
              href={path}
              className="mt-1 inline-flex text-sm font-medium text-sky-300 transition hover:text-sky-200"
            >
              Abrir {title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
