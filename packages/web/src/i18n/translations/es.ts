export const es: Record<string, string> = {
  // Nav
  'nav.features': 'Funciones',
  'nav.install': 'Instalar',
  'nav.demos': 'Demos',
  'nav.api': 'API',
  'nav.dashboard': 'Panel',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'Codigo abierto · Compatible con Git · Autoalojado',
  'hero.title': 'Enlaces cortos,',
  'hero.titleAccent': 'control total.',
  'hero.description':
    'Un acortador de URLs rapido que te pertenece. Gestiona enlaces desde tu terminal, rastrealos en git y sirve redirecciones desde el edge.',
  'hero.cta': 'Comenzar',
  'hero.github': 'Ver en GitHub',

  // Features
  'features.label': 'Funciones',
  'features.title': 'Todo lo que necesitas',
  'features.subtitle':
    'Un stack completo de acortamiento de URLs — del terminal al edge — sin dependencia de proveedores.',
  'features.edge.title': 'Redirecciones ultrarapidas en el Edge',
  'features.edge.desc':
    'Cloudflare Worker sirve redirecciones 302 desde mas de 300 ubicaciones. Consultas KV en submilisegundos.',
  'features.cli.title': 'Flujo de trabajo CLI-First',
  'features.cli.desc':
    'Acorta, lista, elimina y despliega desde tu terminal. Salida compatible con pipes para scripting.',
  'features.git.title': 'Base de datos rastreada con Git',
  'features.git.desc':
    'Las URLs viven en un archivo JSON que commiteas junto a tu codigo. Historial completo, diffs y revision de codigo.',
  'features.utm.title': 'Seguimiento UTM integrado',
  'features.utm.desc':
    'Agrega utm_source, utm_medium y utm_campaign a cualquier enlace. Se agregan automaticamente al redirigir.',
  'features.selfhosted.title': 'Autoalojado y codigo abierto',
  'features.selfhosted.desc':
    'Sin servicios de terceros. Despliega en tu propia cuenta de Cloudflare. Licencia MIT.',
  'features.expiry.title': 'Expiracion de enlaces',
  'features.expiry.desc':
    'Establece fechas de expiracion en los enlaces. El worker devuelve 410 Gone para slugs expirados automaticamente.',
  'features.slugs.title': 'Slugs personalizados',
  'features.slugs.desc':
    'Usa slugs significativos como /docs o /launch. Se generan slugs aleatorios si lo prefieres.',
  'features.bulk.title': 'Importacion masiva',
  'features.bulk.desc':
    'Importa URLs desde JSON o CSV. Exporta tu base de datos en cualquier momento como respaldo.',
  'features.qr.title': 'Codigos QR',
  'features.qr.desc': 'Genera codigos QR para cualquier enlace corto. Descarga como SVG o PNG.',
  'features.json.title': 'Salida JSON',
  'features.json.desc':
    'Cada comando soporta --json para salida legible por maquinas. Conecta con jq, scripts o CI.',
  'features.deploy.title': 'Desplegar a KV',
  'features.deploy.desc':
    'Un solo comando sube tu urls.json local a Cloudflare KV para que el worker lo sirva.',
  'features.tags.title': 'Sistema de etiquetas',
  'features.tags.desc': 'Organiza enlaces con etiquetas. Filtra por etiqueta en el CLI o el panel.',
  'features.search.title': 'Buscar y filtrar',
  'features.search.desc':
    'Encuentra enlaces por slug, URL o descripcion. Busqueda del lado del cliente en el panel.',
  'features.zero.title': 'Cero dependencias',
  'features.zero.desc':
    'El paquete principal tiene una sola dependencia de 4KB. Sin bloat, sin riesgo en la cadena de suministro.',
  'features.typescript.title': 'API TypeScript',
  'features.typescript.desc':
    'Importa y usa programaticamente. Seguridad de tipos completa con tipos exportados.',
  'features.monorepo.title': 'Listo para monorepo',
  'features.monorepo.desc':
    'Construido como un monorepo pnpm. Los paquetes Core, CLI, web y worker funcionan juntos.',

  // Install
  'install.label': 'Instalacion',
  'install.title': 'Comienza en segundos',
  'install.subtitle': 'Instala con tu gestor de paquetes favorito.',

  // Comparison
  'comparison.label': '¿Por que clipr?',
  'comparison.title': 'Antes y despues',
  'comparison.before': 'La forma antigua',
  'comparison.after': 'La forma clipr',

  // Demo
  'demo.label': 'Demos CLI',
  'demo.title': 'Velo en accion',
  'demo.subtitle': 'Comandos reales, salida real.',

  // API
  'api.label': 'API programatica',
  'api.title': 'Usa como libreria',
  'api.subtitle': 'Importa @clipr/core en tus propias herramientas.',

  // Footer
  'footer.tagline': 'Un acortador de URLs rapido, compatible con git y que te pertenece.',
  'footer.quicklinks': 'Enlaces rapidos',
  'footer.resources': 'Recursos',
  'footer.connect': 'Conectar',
  'footer.rights': 'Licencia MIT. Todos los derechos reservados.',
};
