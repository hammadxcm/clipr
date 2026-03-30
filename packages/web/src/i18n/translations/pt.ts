export const pt: Record<string, string> = {
  // Nav
  'nav.features': 'Funcionalidades',
  'nav.install': 'Instalar',
  'nav.demos': 'Demos',
  'nav.api': 'API',
  'nav.dashboard': 'Painel',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'Codigo aberto · Compativel com Git · Auto-hospedado',
  'hero.title': 'Links curtos,',
  'hero.titleAccent': 'controle total.',
  'hero.description':
    'Um encurtador de URLs rapido que e seu. Gerencie links pelo terminal, rastreie no git e sirva redirecionamentos pelo edge.',
  'hero.cta': 'Comecar',
  'hero.github': 'Ver no GitHub',

  // Features
  'features.label': 'Funcionalidades',
  'features.title': 'Tudo o que voce precisa',
  'features.subtitle':
    'Uma stack completa de encurtamento de URLs — do terminal ao edge — sem dependencia de fornecedor.',
  'features.edge.title': 'Redirecionamentos ultra-rapidos no Edge',
  'features.edge.desc':
    'Cloudflare Worker serve redirecionamentos 302 de mais de 300 locais. Consultas KV em submilissegundos.',
  'features.cli.title': 'Workflow CLI-First',
  'features.cli.desc':
    'Encurte, liste, delete e faca deploy pelo terminal. Saida compativel com pipe para scripting.',
  'features.git.title': 'Banco de dados rastreado pelo Git',
  'features.git.desc':
    'As URLs ficam em um arquivo JSON que voce commita junto com seu codigo. Historico completo, diffs e revisao de codigo.',
  'features.utm.title': 'Rastreamento UTM integrado',
  'features.utm.desc':
    'Adicione utm_source, utm_medium e utm_campaign a qualquer link. Adicionados automaticamente no redirecionamento.',
  'features.selfhosted.title': 'Auto-hospedado e codigo aberto',
  'features.selfhosted.desc':
    'Sem servicos de terceiros. Faca deploy na sua propria conta Cloudflare. Licenca MIT.',
  'features.expiry.title': 'Expiracao de links',
  'features.expiry.desc':
    'Defina datas de expiracao nos links. O worker retorna 410 Gone para slugs expirados automaticamente.',
  'features.slugs.title': 'Slugs personalizados',
  'features.slugs.desc':
    'Use slugs significativos como /docs ou /launch. Slugs aleatorios sao gerados se preferir.',
  'features.bulk.title': 'Importacao em massa',
  'features.bulk.desc':
    'Importe URLs de JSON ou CSV. Exporte seu banco de dados a qualquer momento para backup.',
  'features.qr.title': 'Codigos QR',
  'features.qr.desc': 'Gere codigos QR para qualquer link curto. Baixe como SVG ou PNG.',
  'features.json.title': 'Saida JSON',
  'features.json.desc':
    'Cada comando suporta --json para saida legivel por maquinas. Redirecione para jq, scripts ou CI.',
  'features.deploy.title': 'Deploy para KV',
  'features.deploy.desc':
    'Um unico comando envia seu urls.json local para o Cloudflare KV para o worker servir.',
  'features.tags.title': 'Sistema de tags',
  'features.tags.desc': 'Organize links com tags. Filtre por tag no CLI ou no painel.',
  'features.search.title': 'Busca e filtro',
  'features.search.desc':
    'Encontre links por slug, URL ou descricao. Busca do lado do cliente no painel.',
  'features.zero.title': 'Zero dependencias',
  'features.zero.desc':
    'O pacote principal tem uma unica dependencia de 4KB. Sem bloat, sem risco na cadeia de suprimentos.',
  'features.typescript.title': 'API TypeScript',
  'features.typescript.desc':
    'Importe e use programaticamente. Seguranca de tipos completa com tipos exportados.',
  'features.monorepo.title': 'Pronto para monorepo',
  'features.monorepo.desc':
    'Construido como um monorepo pnpm. Os pacotes Core, CLI, web e worker funcionam juntos.',

  // Install
  'install.label': 'Instalacao',
  'install.title': 'Comece em segundos',
  'install.subtitle': 'Instale com seu gerenciador de pacotes favorito.',

  // Comparison
  'comparison.label': 'Por que clipr?',
  'comparison.title': 'Antes e depois',
  'comparison.before': 'O jeito antigo',
  'comparison.after': 'O jeito clipr',

  // Demo
  'demo.label': 'Demos CLI',
  'demo.title': 'Veja em acao',
  'demo.subtitle': 'Comandos reais, saida real.',

  // API
  'api.label': 'API programatica',
  'api.title': 'Use como biblioteca',
  'api.subtitle': 'Importe @clipr/core nas suas proprias ferramentas.',

  // Footer
  'footer.tagline': 'Um encurtador de URLs rapido, compativel com git e que e seu.',
  'footer.quicklinks': 'Links rapidos',
  'footer.resources': 'Recursos',
  'footer.connect': 'Conectar',
  'footer.rights': 'Licenca MIT. Todos os direitos reservados.',
};
