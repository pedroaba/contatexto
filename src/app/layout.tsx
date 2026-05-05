import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/structured-data";
import {
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebsiteSchema,
  seoSite,
} from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(seoSite.url),
  title: {
    default: seoSite.name,
    template: `%s | ${seoSite.name}`,
  },
  description:
    "Ferramenta online para contar caracteres, palavras, frases, paragrafos e revisar textos com foco em clareza, SEO e produtividade.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className="bg-background">
        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StructuredData
            data={[
              buildWebsiteSchema(),
              buildOrganizationSchema(),
              buildSoftwareApplicationSchema(),
            ]}
          />
          {children}
          <Toaster closeButton position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
