import Script from "next/script";

import type { JsonLdNode } from "@/lib/seo";

interface StructuredDataProps {
  data: JsonLdNode | JsonLdNode[];
}

export function StructuredData({ data }: StructuredDataProps) {
  const scripts = Array.isArray(data) ? data : [data];

  return (
    <>
      {scripts.map((item, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(item)}
        </Script>
      ))}
    </>
  );
}
