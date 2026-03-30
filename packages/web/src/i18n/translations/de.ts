export const de: Record<string, string> = {
  // Nav
  'nav.features': 'Funktionen',
  'nav.install': 'Installieren',
  'nav.demos': 'Demos',
  'nav.api': 'API',
  'nav.dashboard': 'Dashboard',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'Open Source · Git-freundlich · Selbst gehostet',
  'hero.title': 'Kurze Links,',
  'hero.titleAccent': 'volle Kontrolle.',
  'hero.description':
    'Ein schneller URL-Shortener, der dir gehoert. Verwalte Links ueber dein Terminal, tracke sie in Git und liefere Weiterleitungen vom Edge.',
  'hero.cta': 'Loslegen',
  'hero.github': 'Auf GitHub ansehen',

  // Features
  'features.label': 'Funktionen',
  'features.title': 'Alles was du brauchst',
  'features.subtitle':
    'Ein kompletter URL-Shortening-Stack — vom Terminal zum Edge — ohne Anbieterabhaengigkeit.',
  'features.edge.title': 'Blitzschnelle Edge-Weiterleitungen',
  'features.edge.desc':
    'Cloudflare Worker liefert 302-Weiterleitungen von ueber 300 Standorten. KV-Abfragen im Submillisekundenbereich.',
  'features.cli.title': 'CLI-First Workflow',
  'features.cli.desc':
    'Kuerzen, auflisten, loeschen und deployen direkt aus dem Terminal. Pipe-freundliche Ausgabe fuer Scripting.',
  'features.git.title': 'Git-getrackte Datenbank',
  'features.git.desc':
    'URLs leben in einer JSON-Datei, die du zusammen mit deinem Code commitest. Vollstaendige Historie, Diffs und Code-Review.',
  'features.utm.title': 'Integriertes UTM-Tracking',
  'features.utm.desc':
    'Fuege utm_source, utm_medium und utm_campaign zu jedem Link hinzu. Wird automatisch bei der Weiterleitung angehaengt.',
  'features.selfhosted.title': 'Selbst gehostet und Open Source',
  'features.selfhosted.desc':
    'Keine Drittanbieter-Dienste. Deploye auf deinem eigenen Cloudflare-Konto. MIT-Lizenz.',
  'features.expiry.title': 'Link-Ablaufdatum',
  'features.expiry.desc':
    'Setze Ablaufdaten fuer Links. Der Worker gibt automatisch 410 Gone fuer abgelaufene Slugs zurueck.',
  'features.slugs.title': 'Benutzerdefinierte Slugs',
  'features.slugs.desc':
    'Verwende aussagekraeftige Slugs wie /docs oder /launch. Zufaellige Slugs werden generiert, wenn du es bevorzugst.',
  'features.bulk.title': 'Massenimport',
  'features.bulk.desc':
    'Importiere URLs aus JSON oder CSV. Exportiere deine Datenbank jederzeit als Backup.',
  'features.qr.title': 'QR-Codes',
  'features.qr.desc': 'Generiere QR-Codes fuer jeden Kurzlink. Download als SVG oder PNG.',
  'features.json.title': 'JSON-Ausgabe',
  'features.json.desc':
    'Jeder Befehl unterstuetzt --json fuer maschinenlesbare Ausgabe. Leite an jq, Skripte oder CI weiter.',
  'features.deploy.title': 'Deployen auf KV',
  'features.deploy.desc':
    'Ein einziger Befehl pusht deine lokale urls.json zu Cloudflare KV, damit der Worker sie ausliefern kann.',
  'features.tags.title': 'Tag-System',
  'features.tags.desc': 'Organisiere Links mit Tags. Filtere nach Tag im CLI oder Dashboard.',
  'features.search.title': 'Suchen und Filtern',
  'features.search.desc':
    'Finde Links nach Slug, URL oder Beschreibung. Client-seitige Suche im Dashboard.',
  'features.zero.title': 'Null Abhaengigkeiten',
  'features.zero.desc':
    'Das Core-Paket hat eine einzige 4KB-Abhaengigkeit. Kein Bloat, kein Supply-Chain-Risiko.',
  'features.typescript.title': 'TypeScript API',
  'features.typescript.desc':
    'Importiere und nutze es programmatisch. Volle Typsicherheit mit exportierten Typen.',
  'features.monorepo.title': 'Monorepo-bereit',
  'features.monorepo.desc':
    'Gebaut als pnpm Monorepo. Core-, CLI-, Web- und Worker-Pakete arbeiten zusammen.',

  // Install
  'install.label': 'Installation',
  'install.title': 'In Sekunden starten',
  'install.subtitle': 'Installiere mit deinem bevorzugten Paketmanager.',

  // Comparison
  'comparison.label': 'Warum clipr?',
  'comparison.title': 'Vorher und Nachher',
  'comparison.before': 'Der alte Weg',
  'comparison.after': 'Der clipr Weg',

  // Demo
  'demo.label': 'CLI Demos',
  'demo.title': 'Sieh es in Aktion',
  'demo.subtitle': 'Echte Befehle, echte Ausgabe.',

  // API
  'api.label': 'Programmatische API',
  'api.title': 'Als Bibliothek nutzen',
  'api.subtitle': 'Importiere @clipr/core in deinen eigenen Tools.',

  // Footer
  'footer.tagline': 'Ein schneller, git-freundlicher URL-Shortener, der dir gehoert.',
  'footer.quicklinks': 'Schnelllinks',
  'footer.resources': 'Ressourcen',
  'footer.connect': 'Verbinden',
  'footer.rights': 'MIT-Lizenz. Alle Rechte vorbehalten.',
};
