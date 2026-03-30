export const ru: Record<string, string> = {
  // Nav
  'nav.features': 'Возможности',
  'nav.install': 'Установка',
  'nav.demos': 'Демо',
  'nav.api': 'API',
  'nav.dashboard': 'Панель',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'Открытый код · Совместим с Git · Самостоятельный хостинг',
  'hero.title': 'Короткие ссылки,',
  'hero.titleAccent': 'полный контроль.',
  'hero.description':
    'Быстрый сокращатель URL, который принадлежит вам. Управляйте ссылками из терминала, отслеживайте в git и раздавайте редиректы с edge.',
  'hero.cta': 'Начать',
  'hero.github': 'Смотреть на GitHub',

  // Features
  'features.label': 'Возможности',
  'features.title': 'Все что вам нужно',
  'features.subtitle':
    'Полный стек сокращения URL — от терминала до edge — без привязки к поставщику.',
  'features.edge.title': 'Молниеносные Edge-редиректы',
  'features.edge.desc':
    'Cloudflare Worker раздает 302-редиректы из 300+ локаций. KV-запросы за доли миллисекунды.',
  'features.cli.title': 'CLI-First рабочий процесс',
  'features.cli.desc':
    'Сокращайте, просматривайте, удаляйте и деплойте из терминала. Вывод совместим с pipe для скриптов.',
  'features.git.title': 'База данных в Git',
  'features.git.desc':
    'URL хранятся в JSON-файле, который вы коммитите вместе с кодом. Полная история, диффы и код-ревью.',
  'features.utm.title': 'Встроенное UTM-отслеживание',
  'features.utm.desc':
    'Добавляйте utm_source, utm_medium и utm_campaign к любой ссылке. Автоматически добавляются при редиректе.',
  'features.selfhosted.title': 'Самостоятельный хостинг и открытый код',
  'features.selfhosted.desc':
    'Никаких сторонних сервисов. Деплойте на свой аккаунт Cloudflare. Лицензия MIT.',
  'features.expiry.title': 'Срок действия ссылок',
  'features.expiry.desc':
    'Устанавливайте даты истечения для ссылок. Worker автоматически возвращает 410 Gone для просроченных слагов.',
  'features.slugs.title': 'Пользовательские слаги',
  'features.slugs.desc':
    'Используйте осмысленные слаги вроде /docs или /launch. Случайные слаги генерируются по желанию.',
  'features.bulk.title': 'Массовый импорт',
  'features.bulk.desc':
    'Импортируйте URL из JSON или CSV. Экспортируйте базу данных в любое время для резервного копирования.',
  'features.qr.title': 'QR-коды',
  'features.qr.desc':
    'Генерируйте QR-коды для любой короткой ссылки. Скачивайте в формате SVG или PNG.',
  'features.json.title': 'Вывод в JSON',
  'features.json.desc':
    'Каждая команда поддерживает --json для машиночитаемого вывода. Передавайте в jq, скрипты или CI.',
  'features.deploy.title': 'Деплой в KV',
  'features.deploy.desc':
    'Одна команда отправляет ваш локальный urls.json в Cloudflare KV для раздачи worker-ом.',
  'features.tags.title': 'Система тегов',
  'features.tags.desc': 'Организуйте ссылки с помощью тегов. Фильтруйте по тегу в CLI или панели.',
  'features.search.title': 'Поиск и фильтрация',
  'features.search.desc':
    'Находите ссылки по слагу, URL или описанию. Поиск на стороне клиента в панели.',
  'features.zero.title': 'Ноль зависимостей',
  'features.zero.desc':
    'Основной пакет имеет единственную зависимость на 4KB. Без раздувания, без риска цепочки поставок.',
  'features.typescript.title': 'TypeScript API',
  'features.typescript.desc':
    'Импортируйте и используйте программно. Полная типобезопасность с экспортированными типами.',
  'features.monorepo.title': 'Готов к монорепо',
  'features.monorepo.desc':
    'Построен как монорепо pnpm. Пакеты Core, CLI, web и worker работают вместе.',

  // Install
  'install.label': 'Установка',
  'install.title': 'Начните за секунды',
  'install.subtitle': 'Установите с помощью вашего любимого пакетного менеджера.',

  // Comparison
  'comparison.label': 'Почему clipr?',
  'comparison.title': 'До и после',
  'comparison.before': 'Старый способ',
  'comparison.after': 'Способ clipr',

  // Demo
  'demo.label': 'Демо CLI',
  'demo.title': 'Смотрите в действии',
  'demo.subtitle': 'Реальные команды, реальный вывод.',

  // API
  'api.label': 'Программный API',
  'api.title': 'Используйте как библиотеку',
  'api.subtitle': 'Импортируйте @clipr/core в свои инструменты.',

  // Footer
  'footer.tagline': 'Быстрый, git-совместимый сокращатель URL, который принадлежит вам.',
  'footer.quicklinks': 'Быстрые ссылки',
  'footer.resources': 'Ресурсы',
  'footer.connect': 'Связаться',
  'footer.rights': 'Лицензия MIT. Все права защищены.',
};
