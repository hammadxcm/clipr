export const fr: Record<string, string> = {
  // Nav
  'nav.features': 'Fonctionnalites',
  'nav.install': 'Installer',
  'nav.demos': 'Demos',
  'nav.api': 'API',
  'nav.dashboard': 'Tableau de bord',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'Open source · Compatible Git · Auto-heberge',
  'hero.title': 'Liens courts,',
  'hero.titleAccent': 'controle total.',
  'hero.description':
    "Un raccourcisseur d'URLs rapide qui vous appartient. Gerez vos liens depuis le terminal, suivez-les dans git et servez les redirections depuis l'edge.",
  'hero.cta': 'Commencer',
  'hero.github': 'Voir sur GitHub',

  // Features
  'features.label': 'Fonctionnalites',
  'features.title': 'Tout ce dont vous avez besoin',
  'features.subtitle':
    "Une stack complete de raccourcissement d'URLs — du terminal a l'edge — sans dependance fournisseur.",
  'features.edge.title': 'Redirections ultra-rapides en Edge',
  'features.edge.desc':
    'Cloudflare Worker sert des redirections 302 depuis plus de 300 emplacements. Requetes KV en sous-milliseconde.',
  'features.cli.title': 'Workflow CLI-First',
  'features.cli.desc':
    'Raccourcissez, listez, supprimez et deployez depuis votre terminal. Sortie compatible pipe pour le scripting.',
  'features.git.title': 'Base de donnees suivie par Git',
  'features.git.desc':
    'Les URLs vivent dans un fichier JSON que vous commitez avec votre code. Historique complet, diffs et revue de code.',
  'features.utm.title': 'Suivi UTM integre',
  'features.utm.desc':
    "Ajoutez utm_source, utm_medium et utm_campaign a n'importe quel lien. Ajoutes automatiquement lors de la redirection.",
  'features.selfhosted.title': 'Auto-heberge et open source',
  'features.selfhosted.desc':
    'Aucun service tiers. Deployez sur votre propre compte Cloudflare. Licence MIT.',
  'features.expiry.title': 'Expiration des liens',
  'features.expiry.desc':
    "Definissez des dates d'expiration sur les liens. Le worker renvoie 410 Gone pour les slugs expires automatiquement.",
  'features.slugs.title': 'Slugs personnalises',
  'features.slugs.desc':
    'Utilisez des slugs significatifs comme /docs ou /launch. Des slugs aleatoires sont generes si vous preferez.',
  'features.bulk.title': 'Import en masse',
  'features.bulk.desc':
    'Importez des URLs depuis JSON ou CSV. Exportez votre base de donnees a tout moment pour la sauvegarde.',
  'features.qr.title': 'Codes QR',
  'features.qr.desc':
    "Generez des codes QR pour n'importe quel lien court. Telechargez en SVG ou PNG.",
  'features.json.title': 'Sortie JSON',
  'features.json.desc':
    'Chaque commande supporte --json pour une sortie lisible par machine. Redirigez vers jq, des scripts ou CI.',
  'features.deploy.title': 'Deployer vers KV',
  'features.deploy.desc':
    'Une seule commande pousse votre urls.json local vers Cloudflare KV pour que le worker le serve.',
  'features.tags.title': 'Systeme de tags',
  'features.tags.desc':
    'Organisez vos liens avec des tags. Filtrez par tag dans le CLI ou le tableau de bord.',
  'features.search.title': 'Recherche et filtrage',
  'features.search.desc':
    'Trouvez des liens par slug, URL ou description. Recherche cote client dans le tableau de bord.',
  'features.zero.title': 'Zero dependances',
  'features.zero.desc':
    "Le package principal a une seule dependance de 4KB. Pas de bloat, pas de risque de chaine d'approvisionnement.",
  'features.typescript.title': 'API TypeScript',
  'features.typescript.desc':
    'Importez et utilisez de maniere programmatique. Securite de type complete avec des types exportes.',
  'features.monorepo.title': 'Pret pour le monorepo',
  'features.monorepo.desc':
    'Construit comme un monorepo pnpm. Les packages Core, CLI, web et worker fonctionnent ensemble.',

  // Install
  'install.label': 'Installation',
  'install.title': 'Commencez en quelques secondes',
  'install.subtitle': 'Installez avec votre gestionnaire de paquets prefere.',

  // Comparison
  'comparison.label': 'Pourquoi clipr ?',
  'comparison.title': 'Avant et apres',
  'comparison.before': "L'ancienne methode",
  'comparison.after': 'La methode clipr',

  // Demo
  'demo.label': 'Demos CLI',
  'demo.title': 'Voyez-le en action',
  'demo.subtitle': 'Commandes reelles, sortie reelle.',

  // API
  'api.label': 'API programmatique',
  'api.title': 'Utilisez comme librairie',
  'api.subtitle': 'Importez @clipr/core dans vos propres outils.',

  // Footer
  'footer.tagline': "Un raccourcisseur d'URLs rapide, compatible git et qui vous appartient.",
  'footer.quicklinks': 'Liens rapides',
  'footer.resources': 'Ressources',
  'footer.connect': 'Se connecter',
  'footer.rights': 'Licence MIT. Tous droits reserves.',
};
