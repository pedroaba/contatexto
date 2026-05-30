import { buildMetadata, type SeoPath } from "@/lib/seo";

export type GuideSlug =
  | "contador-de-caracteres"
  | "contador-de-palavras"
  | "meta-title-meta-description"
  | "tempo-de-leitura"
  | "legendas-redes-sociais"
  | "revisao-de-textos";

export interface GuideExample {
  label: string;
  bad?: string;
  good: string;
  note: string;
}

export interface EditorialGuide {
  slug: GuideSlug;
  path: SeoPath;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  keywords: string[];
  sections: Array<{
    title: string;
    body: string[];
  }>;
  examples: GuideExample[];
  checklist: string[];
  related: GuideSlug[];
}

export const editorialGuides: Record<GuideSlug, EditorialGuide> = {
  "contador-de-caracteres": {
    slug: "contador-de-caracteres",
    path: "/contador-de-caracteres",
    eyebrow: "Guia de contagem",
    title: "Contador de caracteres: como revisar tamanho, clareza e limites",
    description:
      "Entenda como contar caracteres com e sem espaços, quando essa métrica importa e como usar limites de texto em SEO, redes sociais e anúncios.",
    intro:
      "A contagem de caracteres parece simples, mas muda bastante dependendo do canal. Um título de página, uma legenda, uma bio e uma descrição de anúncio têm objetivos diferentes. Este guia explica como interpretar os números antes de publicar.",
    keywords: [
      "contador de caracteres",
      "caracteres com espaços",
      "caracteres sem espaços",
      "limite de caracteres",
      "contagem de texto",
    ],
    sections: [
      {
        title: "O que entra na contagem de caracteres",
        body: [
          "Caracteres são letras, números, pontuação, acentos, emojis, símbolos e espaços. Quando uma plataforma limita o tamanho de um texto, ela normalmente conta tudo que ocupa posição visível ou estrutural no campo.",
          "A diferença entre caracteres com espaços e sem espaços é importante porque alguns revisores usam a primeira métrica para limites de interface, enquanto análises editoriais usam a segunda para entender a densidade real do texto.",
        ],
      },
      {
        title: "Quando usar caracteres com espaços",
        body: [
          "Use caracteres com espaços para títulos, descrições, bios, posts e campos de formulário. Essa é a métrica mais próxima do que o usuário realmente publica.",
          "Ela também ajuda a evitar cortes visuais em snippets, cards sociais, anúncios e resultados de busca.",
        ],
      },
      {
        title: "Como transformar a métrica em revisão",
        body: [
          "Não reduza um texto apenas para caber no limite. Primeiro remova repetições, palavras vagas e frases que não acrescentam informação. Depois ajuste conectivos e pontuação.",
          "Um bom texto curto mantém contexto suficiente para o leitor entender a promessa, o assunto e a ação esperada.",
        ],
      },
    ],
    examples: [
      {
        label: "Meta title",
        bad: "Ferramenta online gratuita muito completa para contar caracteres e palavras",
        good: "Contador de caracteres online gratuito",
        note: "A versão curta preserva a intenção principal e reduz risco de corte.",
      },
      {
        label: "Bio",
        bad: "Ajudamos pessoas que escrevem textos para vários lugares diferentes todos os dias",
        good: "Ferramentas rápidas para revisar textos, SEO e redes sociais.",
        note: "A versão revisada explica o valor com menos dispersão.",
      },
    ],
    checklist: [
      "Verifique caracteres com espaços quando houver limite de campo.",
      "Use caracteres sem espaços para comparar densidade do texto.",
      "Remova palavras repetidas antes de cortar informação útil.",
      "Teste títulos e descrições em tamanhos próximos ao limite.",
      "Revise emojis e quebras de linha quando a plataforma contar símbolos especiais.",
    ],
    related: ["contador-de-palavras", "meta-title-meta-description", "legendas-redes-sociais"],
  },
  "contador-de-palavras": {
    slug: "contador-de-palavras",
    path: "/contador-de-palavras",
    eyebrow: "Guia de escrita",
    title: "Contador de palavras: como medir tamanho, ritmo e profundidade",
    description:
      "Aprenda a usar a contagem de palavras para revisar posts, artigos, páginas, roteiros, descrições e textos profissionais com mais precisão.",
    intro:
      "A contagem de palavras ajuda a estimar profundidade, esforço de leitura e espaço necessário para desenvolver uma ideia. Ela não mede qualidade sozinha, mas mostra se o texto está curto demais para explicar algo ou longo demais para a intenção do canal.",
    keywords: [
      "contador de palavras",
      "contagem de palavras",
      "quantidade de palavras",
      "revisão de texto",
      "tamanho de texto",
    ],
    sections: [
      {
        title: "Por que contar palavras",
        body: [
          "Palavras indicam o volume real de conteúdo. Dois textos podem ter número parecido de caracteres, mas ritmos diferentes se um usa palavras longas e outro usa frases mais diretas.",
          "Para blogs, páginas de serviço e materiais educativos, a contagem ajuda a perceber se o assunto foi tratado com profundidade suficiente.",
        ],
      },
      {
        title: "Contagem ideal depende da intenção",
        body: [
          "Um post social pode funcionar com poucas palavras se a ideia for simples. Um guia precisa de mais espaço para contexto, exemplos e ressalvas.",
          "Antes de mirar um número fixo, defina a tarefa do texto: informar, comparar, vender, orientar, resumir ou chamar para uma ação.",
        ],
      },
      {
        title: "Como revisar pela contagem",
        body: [
          "Se o texto ficou longo, procure frases que repetem a mesma promessa. Se ficou curto, veja se faltam exemplos, critérios, passos ou contexto para o leitor agir.",
          "A melhor revisão combina contagem de palavras, legibilidade, parágrafos curtos e uma sequência lógica de ideias.",
        ],
      },
    ],
    examples: [
      {
        label: "Post curto",
        good: "Use 40 a 120 palavras quando a mensagem tiver uma ideia central e uma chamada simples.",
        note: "Bom para redes sociais, avisos rápidos e microcopy.",
      },
      {
        label: "Guia prático",
        good: "Use mais palavras quando o leitor precisa de critérios, exemplos e passos para decidir.",
        note: "Conteúdo útil tende a explicar o raciocínio, não só listar dicas.",
      },
    ],
    checklist: [
      "Compare a contagem com a intenção do texto.",
      "Evite aumentar palavras apenas para parecer mais completo.",
      "Divida blocos longos em parágrafos escaneáveis.",
      "Use exemplos quando o tema exigir aplicação prática.",
      "Corte redundâncias antes de cortar explicações importantes.",
    ],
    related: ["contador-de-caracteres", "tempo-de-leitura", "revisao-de-textos"],
  },
  "meta-title-meta-description": {
    slug: "meta-title-meta-description",
    path: "/meta-title-meta-description",
    eyebrow: "SEO on-page",
    title: "Meta title e meta description: tamanhos, exemplos e checklist",
    description:
      "Guia prático para escrever meta titles e meta descriptions claros, úteis e dentro de tamanhos seguros para resultados de busca.",
    intro:
      "Meta title e meta description ajudam o usuário a entender o conteúdo antes do clique. O objetivo não é apenas caber em um limite, mas prometer com clareza o que a página realmente entrega.",
    keywords: [
      "meta title",
      "meta description",
      "tamanho meta title",
      "tamanho meta description",
      "SEO para textos",
    ],
    sections: [
      {
        title: "Tamanho recomendado",
        body: [
          "Um meta title costuma funcionar melhor perto de 50 a 60 caracteres. A meta description geralmente fica mais segura entre 140 e 160 caracteres.",
          "Esses números não são regras absolutas, porque o Google pode reescrever snippets. Ainda assim, eles ajudam a criar textos objetivos e menos propensos a cortes.",
        ],
      },
      {
        title: "O que um bom title precisa ter",
        body: [
          "O title deve deixar claro o tema principal da página. Quando possível, coloque o termo mais importante no início, sem transformar o título em uma lista artificial de palavras-chave.",
          "Evite títulos genéricos como 'Home', 'Serviços' ou 'Guia completo' sem contexto. O usuário precisa entender o assunto fora do seu site.",
        ],
      },
      {
        title: "Como escrever a description",
        body: [
          "A description deve resumir o valor da página e dar motivo para o clique. Ela pode mencionar benefício, público, recorte ou resultado esperado.",
          "Não prometa algo que a página não entrega. Esse desalinhamento aumenta rejeição e enfraquece a confiança do usuário.",
        ],
      },
    ],
    examples: [
      {
        label: "Title genérico",
        bad: "Guia completo para melhorar textos",
        good: "Meta title e meta description: guia com exemplos",
        note: "O bom exemplo especifica o tema e a utilidade.",
      },
      {
        label: "Description vaga",
        bad: "Veja dicas incríveis para deixar seu site melhor agora mesmo.",
        good: "Aprenda tamanhos recomendados, exemplos e checklist para escrever meta titles e descriptions mais claros.",
        note: "A versão revisada descreve exatamente o que o usuário encontrará.",
      },
    ],
    checklist: [
      "Use uma intenção principal por página.",
      "Mantenha o title específico e legível.",
      "Evite repetir a mesma palavra-chave sem necessidade.",
      "Escreva a description como resumo útil, não como propaganda vazia.",
      "Compare o tamanho no contador antes de publicar.",
    ],
    related: ["contador-de-caracteres", "revisao-de-textos", "contador-de-palavras"],
  },
  "tempo-de-leitura": {
    slug: "tempo-de-leitura",
    path: "/tempo-de-leitura",
    eyebrow: "Legibilidade",
    title: "Tempo de leitura: como calcular e usar na revisão de conteúdo",
    description:
      "Entenda como estimar tempo de leitura, quando essa métrica é útil e como melhorar textos longos sem perder profundidade.",
    intro:
      "Tempo de leitura ajuda o leitor a decidir se pode consumir um conteúdo naquele momento. Para quem escreve, a métrica mostra se o texto está adequado ao canal, ao assunto e à atenção esperada.",
    keywords: [
      "tempo de leitura",
      "calcular tempo de leitura",
      "legibilidade",
      "revisão de conteúdo",
      "palavras por minuto",
    ],
    sections: [
      {
        title: "Como o tempo de leitura é estimado",
        body: [
          "Uma estimativa comum usa uma média de palavras por minuto. O ContaTexto usa essa lógica para transformar quantidade de palavras em segundos ou minutos aproximados.",
          "A métrica é uma referência, não uma promessa. Textos técnicos, listas densas e frases longas podem exigir mais tempo do que o cálculo indica.",
        ],
      },
      {
        title: "Quando mostrar tempo de leitura",
        body: [
          "Em artigos, guias e materiais educativos, o tempo de leitura reduz incerteza. O usuário entende se está diante de uma leitura rápida ou de um conteúdo mais completo.",
          "Em páginas comerciais curtas, a métrica pode ser menos importante do que clareza, escaneabilidade e chamada para ação.",
        ],
      },
      {
        title: "Como reduzir sem empobrecer",
        body: [
          "Reduzir tempo de leitura não significa remover toda explicação. Primeiro corte redundâncias, introduções longas e frases com a mesma função.",
          "Se o conteúdo precisa ser longo, organize com subtítulos, listas e exemplos para facilitar a navegação.",
        ],
      },
    ],
    examples: [
      {
        label: "Leitura rápida",
        good: "Textos de até 1 minuto funcionam bem para instruções simples, avisos e descrições curtas.",
        note: "A promessa precisa ser direta e o texto deve evitar contexto excessivo.",
      },
      {
        label: "Leitura aprofundada",
        good: "Guias de 4 a 8 minutos podem funcionar quando entregam exemplos, critérios e decisões práticas.",
        note: "O tamanho é aceitável quando há valor em cada seção.",
      },
    ],
    checklist: [
      "Compare tempo de leitura com a complexidade do tema.",
      "Use subtítulos em textos acima de 2 minutos.",
      "Remova parágrafos que repetem a mesma ideia.",
      "Mantenha exemplos quando eles ajudam a aplicar o conteúdo.",
      "Evite blocos longos em telas pequenas.",
    ],
    related: ["contador-de-palavras", "revisao-de-textos", "contador-de-caracteres"],
  },
  "legendas-redes-sociais": {
    slug: "legendas-redes-sociais",
    path: "/legendas-redes-sociais",
    eyebrow: "Redes sociais",
    title: "Legendas para redes sociais: tamanho, clareza e exemplos",
    description:
      "Guia para revisar legendas de Instagram, LinkedIn, YouTube, TikTok e X com foco em tamanho, abertura, escaneabilidade e chamada para ação.",
    intro:
      "Uma legenda boa precisa prender atenção cedo, entregar contexto e respeitar o comportamento de leitura da plataforma. O tamanho importa, mas clareza e ritmo importam mais.",
    keywords: [
      "legendas redes sociais",
      "legenda instagram",
      "post linkedin",
      "tamanho legenda",
      "copy para redes sociais",
    ],
    sections: [
      {
        title: "Comece pela primeira linha",
        body: [
          "Em muitas plataformas, o usuário vê só o início da legenda antes de expandir. A primeira linha deve apresentar uma ideia forte, pergunta útil ou benefício claro.",
          "Evite aberturas genéricas como 'Hoje vamos falar sobre'. Entre direto no problema, no resultado ou no contexto.",
        ],
      },
      {
        title: "Ajuste o tamanho ao canal",
        body: [
          "Instagram aceita legendas longas, mas nem todo post precisa delas. LinkedIn favorece estrutura e ritmo. X exige síntese. YouTube precisa equilibrar título, descrição e termos de busca.",
          "O ContaTexto ajuda a comparar tamanho, frases, parágrafos e limites para evitar cortes ou blocos difíceis de ler.",
        ],
      },
      {
        title: "Use chamada para ação com critério",
        body: [
          "Nem toda legenda precisa pedir comentário, clique ou compartilhamento. A chamada deve fazer sentido com o conteúdo e com a etapa do público.",
          "Uma boa CTA é específica: 'salve para revisar depois' é mais clara do que 'interaja com este post'.",
        ],
      },
    ],
    examples: [
      {
        label: "Abertura fraca",
        bad: "Hoje eu trouxe algumas dicas muito importantes para você.",
        good: "Seu texto parece bom, mas ninguém lê até o fim? Comece pela primeira linha.",
        note: "A versão revisada cria tensão e mostra o problema.",
      },
      {
        label: "CTA genérica",
        bad: "Curta, comente e compartilhe.",
        good: "Salve este checklist para revisar sua próxima legenda.",
        note: "A ação está ligada ao valor do conteúdo.",
      },
    ],
    checklist: [
      "Revise a força da primeira linha.",
      "Quebre blocos longos em parágrafos curtos.",
      "Remova hashtags que não descrevem o tema.",
      "Use CTA específica quando houver próximo passo claro.",
      "Compare tamanho e legibilidade antes de publicar.",
    ],
    related: ["contador-de-caracteres", "contador-de-palavras", "revisao-de-textos"],
  },
  "revisao-de-textos": {
    slug: "revisao-de-textos",
    path: "/revisao-de-textos",
    eyebrow: "Qualidade textual",
    title: "Revisão de textos: checklist para clareza, ritmo e publicação",
    description:
      "Aprenda um processo prático para revisar textos antes de publicar, com foco em clareza, repetição, frases longas, parágrafos e objetivo.",
    intro:
      "Revisar não é apenas corrigir erros. Uma boa revisão verifica se o texto cumpre uma função: informar, convencer, orientar, vender ou resumir. O ContaTexto ajuda a transformar essa análise em sinais objetivos.",
    keywords: [
      "revisão de textos",
      "como revisar textos",
      "clareza textual",
      "legibilidade",
      "checklist de revisão",
    ],
    sections: [
      {
        title: "Revise intenção antes de revisar palavras",
        body: [
          "Antes de cortar frases, defina o objetivo do texto. Um texto sem intenção clara tende a repetir ideias e misturar assuntos.",
          "Pergunte: quem vai ler, o que essa pessoa precisa entender e qual ação ou decisão deve ficar mais fácil depois da leitura?",
        ],
      },
      {
        title: "Procure sinais objetivos",
        body: [
          "Frases muito longas, muitos parágrafos densos e repetição de palavras podem indicar esforço de leitura alto. Esses sinais não condenam o texto, mas mostram onde revisar primeiro.",
          "Métricas ajudam a encontrar problemas, mas a decisão final ainda é editorial. Um termo repetido pode ser necessário; uma frase longa pode funcionar se estiver bem pontuada.",
        ],
      },
      {
        title: "Finalize com leitura em voz baixa",
        body: [
          "Ler em voz baixa revela travas que a contagem não mostra: ritmo estranho, excesso de conectivos, promessa confusa e frases que parecem naturais só no rascunho.",
          "Depois dessa leitura, faça a última checagem de tamanho para garantir que o texto cabe no canal de publicação.",
        ],
      },
    ],
    examples: [
      {
        label: "Frase pesada",
        bad: "Nossa ferramenta tem como objetivo principal possibilitar que usuários realizem a análise textual de maneira prática e eficiente.",
        good: "Nossa ferramenta ajuda você a analisar textos com rapidez e clareza.",
        note: "A versão revisada troca abstrações por uma ação direta.",
      },
      {
        label: "Parágrafo sem foco",
        bad: "O texto fala sobre SEO, redes sociais, produtividade, escrita, métricas e também sobre como publicar melhor.",
        good: "Escolha uma intenção principal para cada texto e organize as métricas ao redor dela.",
        note: "A versão boa transforma uma lista solta em orientação aplicável.",
      },
    ],
    checklist: [
      "Defina a intenção principal do texto.",
      "Corte repetições que não reforçam a mensagem.",
      "Divida parágrafos com muitas ideias.",
      "Troque abstrações por verbos e exemplos concretos.",
      "Confira caracteres, palavras e tempo de leitura antes de publicar.",
    ],
    related: ["contador-de-palavras", "tempo-de-leitura", "meta-title-meta-description"],
  },
};

export const editorialGuideList = Object.values(editorialGuides);

export function getEditorialGuide(slug: GuideSlug) {
  return editorialGuides[slug];
}

export function buildGuideMetadata(slug: GuideSlug) {
  const guide = getEditorialGuide(slug);

  return buildMetadata({
    path: guide.path,
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
  });
}
