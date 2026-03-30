export const zh: Record<string, string> = {
  // Nav
  'nav.features': '功能',
  'nav.install': '安装',
  'nav.demos': '演示',
  'nav.api': 'API',
  'nav.dashboard': '仪表盘',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': '开源 · Git 友好 · 自托管',
  'hero.title': '短链接，',
  'hero.titleAccent': '完全掌控。',
  'hero.description':
    '一个属于你的快速短链接服务。通过终端管理链接，在 git 中追踪，从 edge 提供重定向。',
  'hero.cta': '开始使用',
  'hero.github': '在 GitHub 上查看',

  // Features
  'features.label': '功能',
  'features.title': '你需要的一切',
  'features.subtitle': '完整的短链接技术栈 — 从终端到 edge — 零供应商锁定。',
  'features.edge.title': 'Edge 极速重定向',
  'features.edge.desc': 'Cloudflare Worker 从 300 多个位置提供 302 重定向。亚毫秒级 KV 查询。',
  'features.cli.title': 'CLI 优先工作流',
  'features.cli.desc': '在终端中缩短、列出、删除和部署。支持管道的输出便于脚本编写。',
  'features.git.title': 'Git 追踪数据库',
  'features.git.desc':
    'URL 存储在与代码一起提交的 JSON 文件中。完整的历史记录、差异对比和代码审查。',
  'features.utm.title': '内置 UTM 追踪',
  'features.utm.desc': '为任何链接添加 utm_source、utm_medium 和 utm_campaign。重定向时自动附加。',
  'features.selfhosted.title': '自托管和开源',
  'features.selfhosted.desc': '无第三方服务。部署到你自己的 Cloudflare 账户。MIT 许可证。',
  'features.expiry.title': '链接过期',
  'features.expiry.desc': '为链接设置过期日期。Worker 自动为过期的 slug 返回 410 Gone。',
  'features.slugs.title': '自定义 Slug',
  'features.slugs.desc':
    '使用有意义的 slug，如 /docs 或 /launch。如果你愿意，也可以自动生成随机 slug。',
  'features.bulk.title': '批量导入',
  'features.bulk.desc': '从 JSON 或 CSV 导入 URL。随时导出数据库进行备份。',
  'features.qr.title': 'QR 码',
  'features.qr.desc': '为任何短链接生成 QR 码。下载为 SVG 或 PNG。',
  'features.json.title': 'JSON 输出',
  'features.json.desc': '每个命令都支持 --json 以获得机器可读的输出。可传输到 jq、脚本或 CI。',
  'features.deploy.title': '部署到 KV',
  'features.deploy.desc': '一条命令将你本地的 urls.json 推送到 Cloudflare KV，供 Worker 提供服务。',
  'features.tags.title': '标签系统',
  'features.tags.desc': '使用标签组织链接。在 CLI 或仪表盘中按标签筛选。',
  'features.search.title': '搜索和筛选',
  'features.search.desc': '按 slug、URL 或描述查找链接。仪表盘中的客户端搜索。',
  'features.zero.title': '零依赖',
  'features.zero.desc': '核心包只有一个 4KB 的依赖。无臃肿，无供应链风险。',
  'features.typescript.title': 'TypeScript API',
  'features.typescript.desc': '以编程方式导入和使用。导出类型提供完整的类型安全。',
  'features.monorepo.title': '支持 Monorepo',
  'features.monorepo.desc': '构建为 pnpm monorepo。Core、CLI、web 和 worker 包协同工作。',

  // Install
  'install.label': '安装',
  'install.title': '几秒钟即可开始',
  'install.subtitle': '使用你喜欢的包管理器安装。',

  // Comparison
  'comparison.label': '为什么选择 clipr？',
  'comparison.title': '前后对比',
  'comparison.before': '旧方式',
  'comparison.after': 'clipr 方式',

  // Demo
  'demo.label': 'CLI 演示',
  'demo.title': '实际效果',
  'demo.subtitle': '真实命令，真实输出。',

  // API
  'api.label': '编程 API',
  'api.title': '作为库使用',
  'api.subtitle': '在你的工具中导入 @clipr/core。',

  // Footer
  'footer.tagline': '一个快速、Git 友好、属于你的短链接服务。',
  'footer.quicklinks': '快速链接',
  'footer.resources': '资源',
  'footer.connect': '联系',
  'footer.rights': 'MIT 许可证。保留所有权利。',
};
