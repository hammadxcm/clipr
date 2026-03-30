export const bn: Record<string, string> = {
  // Nav
  'nav.features': 'বৈশিষ্ট্য',
  'nav.install': 'ইনস্টল',
  'nav.demos': 'ডেমো',
  'nav.api': 'API',
  'nav.dashboard': 'ড্যাশবোর্ড',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'ওপেন সোর্স · Git-বান্ধব · সেলফ-হোস্টেড',
  'hero.title': 'সংক্ষিপ্ত লিংক,',
  'hero.titleAccent': 'সম্পূর্ণ নিয়ন্ত্রণ।',
  'hero.description':
    'একটি দ্রুত URL শর্টনার যা আপনার নিজের। টার্মিনাল থেকে লিংক পরিচালনা করুন, git-এ ট্র্যাক করুন, এবং edge থেকে রিডাইরেক্ট সরবরাহ করুন।',
  'hero.cta': 'শুরু করুন',
  'hero.github': 'GitHub-এ দেখুন',

  // Features
  'features.label': 'বৈশিষ্ট্য',
  'features.title': 'আপনার যা কিছু প্রয়োজন',
  'features.subtitle': 'একটি সম্পূর্ণ URL সংক্ষেপণ স্ট্যাক — টার্মিনাল থেকে edge পর্যন্ত — শূন্য ভেন্ডর লক-ইন।',
  'features.edge.title': 'Edge-দ্রুত রিডাইরেক্ট',
  'features.edge.desc':
    'Cloudflare Worker ৩০০+ অবস্থান থেকে 302 রিডাইরেক্ট সরবরাহ করে। সাব-মিলিসেকেন্ড KV লুকআপ।',
  'features.cli.title': 'CLI-ফার্স্ট ওয়ার্কফ্লো',
  'features.cli.desc':
    'টার্মিনাল থেকে সংক্ষেপ করুন, তালিকা করুন, মুছুন এবং ডিপ্লয় করুন। স্ক্রিপ্টিং-এর জন্য পাইপ-বান্ধব আউটপুট।',
  'features.git.title': 'Git-ট্র্যাকড ডেটাবেস',
  'features.git.desc':
    'URL গুলো একটি JSON ফাইলে থাকে যা আপনি আপনার কোডের সাথে কমিট করেন। সম্পূর্ণ ইতিহাস, ডিফ এবং কোড রিভিউ।',
  'features.utm.title': 'বিল্ট-ইন UTM ট্র্যাকিং',
  'features.utm.desc':
    'যেকোনো লিংকে utm_source, utm_medium এবং utm_campaign যোগ করুন। রিডাইরেক্টের সময় স্বয়ংক্রিয়ভাবে যুক্ত হয়।',
  'features.selfhosted.title': 'সেলফ-হোস্টেড এবং ওপেন সোর্স',
  'features.selfhosted.desc':
    'কোনো থার্ড-পার্টি সার্ভিস নেই। আপনার নিজের Cloudflare অ্যাকাউন্টে ডিপ্লয় করুন। MIT লাইসেন্স।',
  'features.expiry.title': 'লিংক মেয়াদ',
  'features.expiry.desc':
    'লিংকে মেয়াদ শেষের তারিখ সেট করুন। Worker মেয়াদোত্তীর্ণ স্লাগের জন্য স্বয়ংক্রিয়ভাবে 410 Gone ফেরত দেয়।',
  'features.slugs.title': 'কাস্টম স্লাগ',
  'features.slugs.desc': '/docs বা /launch-এর মতো অর্থবহ স্লাগ ব্যবহার করুন। আপনি চাইলে র্যান্ডম স্লাগ তৈরি হয়।',
  'features.bulk.title': 'বাল্ক ইমপোর্ট',
  'features.bulk.desc':
    'JSON বা CSV থেকে URL ইমপোর্ট করুন। ব্যাকআপের জন্য যেকোনো সময় আপনার ডেটাবেস এক্সপোর্ট করুন।',
  'features.qr.title': 'QR কোড',
  'features.qr.desc': 'যেকোনো সংক্ষিপ্ত লিংকের জন্য QR কোড তৈরি করুন। SVG বা PNG হিসেবে ডাউনলোড করুন।',
  'features.json.title': 'JSON আউটপুট',
  'features.json.desc':
    'প্রতিটি কমান্ড মেশিন-রিডেবল আউটপুটের জন্য --json সমর্থন করে। jq, স্ক্রিপ্ট বা CI-তে পাইপ করুন।',
  'features.deploy.title': 'KV-তে ডিপ্লয়',
  'features.deploy.desc':
    'একটি কমান্ড আপনার লোকাল urls.json কে Cloudflare KV-তে পুশ করে যাতে Worker সরবরাহ করতে পারে।',
  'features.tags.title': 'ট্যাগ সিস্টেম',
  'features.tags.desc': 'ট্যাগ দিয়ে লিংক সংগঠিত করুন। CLI বা ড্যাশবোর্ডে ট্যাগ অনুযায়ী ফিল্টার করুন।',
  'features.search.title': 'অনুসন্ধান এবং ফিল্টার',
  'features.search.desc': 'স্লাগ, URL বা বিবরণ দ্বারা লিংক খুঁজুন। ড্যাশবোর্ডে ক্লায়েন্ট-সাইড অনুসন্ধান।',
  'features.zero.title': 'শূন্য ডিপেন্ডেন্সি',
  'features.zero.desc':
    'কোর প্যাকেজে মাত্র একটি 4KB ডিপেন্ডেন্সি আছে। কোনো ব্লোট নেই, কোনো সাপ্লাই চেইন ঝুঁকি নেই।',
  'features.typescript.title': 'TypeScript API',
  'features.typescript.desc':
    'প্রোগ্রাম্যাটিকভাবে ইমপোর্ট এবং ব্যবহার করুন। এক্সপোর্টেড টাইপসহ সম্পূর্ণ টাইপ সেফটি।',
  'features.monorepo.title': 'Monorepo প্রস্তুত',
  'features.monorepo.desc':
    'pnpm monorepo হিসেবে নির্মিত। Core, CLI, web এবং worker প্যাকেজ একসাথে কাজ করে।',

  // Install
  'install.label': 'ইনস্টলেশন',
  'install.title': 'সেকেন্ডে শুরু করুন',
  'install.subtitle': 'আপনার পছন্দের প্যাকেজ ম্যানেজার দিয়ে ইনস্টল করুন।',

  // Comparison
  'comparison.label': 'কেন clipr?',
  'comparison.title': 'আগে এবং পরে',
  'comparison.before': 'পুরানো পদ্ধতি',
  'comparison.after': 'clipr পদ্ধতি',

  // Demo
  'demo.label': 'CLI ডেমো',
  'demo.title': 'কার্যকর অবস্থায় দেখুন',
  'demo.subtitle': 'প্রকৃত কমান্ড, প্রকৃত আউটপুট।',

  // API
  'api.label': 'প্রোগ্রাম্যাটিক API',
  'api.title': 'লাইব্রেরি হিসেবে ব্যবহার করুন',
  'api.subtitle': 'আপনার নিজের টুলসে @clipr/core ইমপোর্ট করুন।',

  // Footer
  'footer.tagline': 'একটি দ্রুত, git-বান্ধব URL শর্টনার যা আপনার নিজের।',
  'footer.quicklinks': 'দ্রুত লিংক',
  'footer.resources': 'সম্পদ',
  'footer.connect': 'সংযোগ',
  'footer.rights': 'MIT লাইসেন্স। সর্বস্বত্ব সংরক্ষিত।',
};
