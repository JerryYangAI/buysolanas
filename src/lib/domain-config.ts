export type DomainConfig = {
  domain: string;
  name: string;
  slogan: string;
  sloganZh: string;
  description: string;
  descriptionZh: string;
  accentColor: string;
  icon: string;
  forSale: boolean;
  isMain: boolean;
  features: { title: string; titleZh: string; desc: string; descZh: string; icon: string }[];
};

export const MAIN_DOMAIN = 'buysolanas.com';

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  'buysolanas.com': {
    domain: 'buysolanas.com',
    name: 'BuySolanas',
    slogan: 'From Zero to Solana — Your Web3 Starting Point',
    sloganZh: '从零到 Solana，你的 Web3 第一站',
    description: 'The #1 Chinese Solana education platform. Courses, glossary, live prices, and community.',
    descriptionZh: '中文 Solana 教育与信息平台。课程、词汇表、实时行情、社区，一站搞定。',
    accentColor: '#9945FF',
    icon: '🚀',
    forSale: false,
    isMain: true,
    features: [],
  },
  'buysolana.ai': {
    domain: 'buysolana.ai',
    name: 'BuySolana.AI',
    slogan: 'AI-Powered Solana Intelligence',
    sloganZh: 'AI 驱动的 Solana 智能平台',
    description: 'Leverage artificial intelligence for smarter Solana research, portfolio analysis, and market insights.',
    descriptionZh: '利用人工智能进行更智能的 Solana 研究、投资分析和市场洞察。',
    accentColor: '#00C2FF',
    icon: '🤖',
    forSale: true,
    isMain: false,
    features: [
      { title: 'AI Market Analysis', titleZh: 'AI 行情分析', desc: 'Machine learning models for SOL price prediction and trend detection.', descZh: '机器学习模型用于 SOL 价格预测和趋势检测。', icon: '📊' },
      { title: 'Smart Portfolio', titleZh: '智能投资组合', desc: 'AI-optimized portfolio suggestions based on risk profile.', descZh: '基于风险偏好的 AI 优化投资组合建议。', icon: '💼' },
      { title: 'Natural Language Search', titleZh: '自然语言搜索', desc: 'Ask questions about Solana in plain language and get instant answers.', descZh: '用自然语言提问 Solana 相关问题，获得即时回答。', icon: '💬' },
    ],
  },
  'smartsolana.cn': {
    domain: 'smartsolana.cn',
    name: 'SmartSolana',
    slogan: '智能 Solana，聪明投资',
    sloganZh: '智能 Solana，聪明投资',
    description: 'Smart Solana research and investment tools for the Chinese market.',
    descriptionZh: '面向中国用户的智能 Solana 投研工具平台。',
    accentColor: '#14F195',
    icon: '🧠',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Smart Research', titleZh: '智能投研', desc: 'Data-driven Solana ecosystem research tools.', descZh: '数据驱动的 Solana 生态投研工具。', icon: '🔍' },
      { title: 'Market Alerts', titleZh: '行情预警', desc: 'Real-time price and on-chain activity alerts.', descZh: '实时价格和链上活动预警。', icon: '🔔' },
      { title: 'Chinese Community', titleZh: '中文社区', desc: 'Connect with Chinese-speaking Solana investors.', descZh: '连接中文 Solana 投资者社区。', icon: '👥' },
    ],
  },
  'smartsolarsolana.cn': {
    domain: 'smartsolarsolana.cn',
    name: 'SmartSolarSolana',
    slogan: '绿色能源遇上高速区块链',
    sloganZh: '绿色能源遇上高速区块链',
    description: 'Exploring the intersection of solar energy and Solana blockchain technology.',
    descriptionZh: '探索太阳能与 Solana 区块链技术的交汇点。',
    accentColor: '#FFB800',
    icon: '☀️',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Green Blockchain', titleZh: '绿色区块链', desc: 'Solana\'s energy-efficient consensus and solar energy synergies.', descZh: 'Solana 高效共识机制与太阳能的协同效应。', icon: '🌱' },
      { title: 'Carbon Credits', titleZh: '碳积分', desc: 'Tokenized carbon credits on Solana blockchain.', descZh: '基于 Solana 区块链的碳积分代币化。', icon: '🌍' },
      { title: 'Solar Mining', titleZh: '太阳能挖矿', desc: 'Solar-powered validator nodes and green staking.', descZh: '太阳能驱动的验证节点与绿色质押。', icon: '⚡' },
    ],
  },
  'smartstakesolana.com': {
    domain: 'smartstakesolana.com',
    name: 'SmartStakeSolana',
    slogan: 'Stake Smarter, Earn More SOL',
    sloganZh: '聪明质押，多赚 SOL',
    description: 'The ultimate Solana staking guide. Compare validators, optimize APY, stake with confidence.',
    descriptionZh: '终极 Solana 质押指南。比较验证节点，优化 APY，安心质押。',
    accentColor: '#9945FF',
    icon: '🏦',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Validator Comparison', titleZh: '验证节点对比', desc: 'Compare Solana validators by APY, commission, and uptime.', descZh: '按 APY、佣金和在线时长对比 Solana 验证节点。', icon: '⚖️' },
      { title: 'APY Optimizer', titleZh: 'APY 优化器', desc: 'Find the best staking returns across the Solana network.', descZh: '在 Solana 网络中找到最佳质押收益。', icon: '📈' },
      { title: 'Staking Guides', titleZh: '质押教程', desc: 'Step-by-step guides for staking SOL on every major platform.', descZh: '各大平台 SOL 质押的详细图文教程。', icon: '📚' },
    ],
  },
  'solarsolana.xyz': {
    domain: 'solarsolana.xyz',
    name: 'SolarSolana',
    slogan: 'Where Solar Energy Meets Solana',
    sloganZh: '太阳能与 Solana 的交汇',
    description: 'International hub for solar energy and Solana blockchain convergence.',
    descriptionZh: '太阳能与 Solana 区块链融合的国际平台。',
    accentColor: '#FFB800',
    icon: '🌞',
    forSale: true,
    isMain: false,
    features: [
      { title: 'DePIN Solar', titleZh: 'DePIN 太阳能', desc: 'Decentralized physical infrastructure for solar energy on Solana.', descZh: '基于 Solana 的去中心化太阳能物理基础设施。', icon: '🔌' },
      { title: 'Energy Trading', titleZh: '能源交易', desc: 'Peer-to-peer solar energy trading powered by Solana.', descZh: '基于 Solana 的点对点太阳能交易。', icon: '💡' },
      { title: 'Green DeFi', titleZh: '绿色 DeFi', desc: 'Sustainable DeFi protocols built on Solana.', descZh: '构建在 Solana 上的可持续 DeFi 协议。', icon: '♻️' },
    ],
  },
  'sssolana.com': {
    domain: 'sssolana.com',
    name: 'SSSolana',
    slogan: 'Your Short Path to Solana',
    sloganZh: '通往 Solana 的捷径',
    description: 'Premium short domain for Solana projects. Memorable, brandable, ready to build.',
    descriptionZh: '优质 Solana 短域名。好记、有品牌感、可立即建站。',
    accentColor: '#9945FF',
    icon: '⚡',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Short & Memorable', titleZh: '简短好记', desc: 'Just 9 characters — perfect for branding any Solana project.', descZh: '仅 9 个字符 — 任何 Solana 项目的完美品牌域名。', icon: '✨' },
      { title: 'SEO Advantage', titleZh: 'SEO 优势', desc: 'Contains "solana" keyword for organic search visibility.', descZh: '包含 "solana" 关键词，天然搜索引擎优势。', icon: '🔍' },
      { title: '.com TLD', titleZh: '.com 顶级域', desc: 'The most trusted and recognized top-level domain worldwide.', descZh: '全球最受信任和认可的顶级域名。', icon: '🌐' },
    ],
  },
  'stakesolana.cn': {
    domain: 'stakesolana.cn',
    name: 'StakeSolana',
    slogan: 'Solana 质押，从这里开始',
    sloganZh: 'Solana 质押，从这里开始',
    description: 'The Chinese gateway to Solana staking. Learn, compare, and stake with confidence.',
    descriptionZh: '中国用户的 Solana 质押入口。学习、对比、安心质押。',
    accentColor: '#14F195',
    icon: '🇨🇳',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Chinese Guides', titleZh: '中文教程', desc: 'Staking tutorials in Chinese, designed for mainland users.', descZh: '面向中国大陆用户的中文质押教程。', icon: '📖' },
      { title: 'Local Platforms', titleZh: '本地平台', desc: 'Compare staking options accessible from China.', descZh: '对比中国可访问的质押平台。', icon: '🏢' },
      { title: '.cn Domain', titleZh: '.cn 域名', desc: 'Trusted Chinese TLD for local credibility.', descZh: '中国顶级域名，本地可信度高。', icon: '🔐' },
    ],
  },
  'stakesolanas.com': {
    domain: 'stakesolanas.com',
    name: 'StakeSolanas',
    slogan: 'The Staking Hub for Solana',
    sloganZh: 'Solana 质押中心',
    description: 'Your one-stop destination for everything Solana staking. Guides, tools, and validator insights.',
    descriptionZh: '一站式 Solana 质押平台。教程、工具和验证节点洞察。',
    accentColor: '#9945FF',
    icon: '🔒',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Staking Dashboard', titleZh: '质押仪表盘', desc: 'Track your staking rewards and validator performance.', descZh: '追踪质押收益和验证节点表现。', icon: '📊' },
      { title: 'Reward Calculator', titleZh: '收益计算器', desc: 'Estimate your SOL staking returns before committing.', descZh: '质押前预估 SOL 质押收益。', icon: '🧮' },
      { title: 'Risk Assessment', titleZh: '风险评估', desc: 'Evaluate validator risks and choose the safest options.', descZh: '评估验证节点风险，选择最安全的方案。', icon: '🛡️' },
    ],
  },
  'upexisolana.com': {
    domain: 'upexisolana.com',
    name: 'UPEXISolana',
    slogan: 'Enterprise Solana Solutions',
    sloganZh: '企业级 Solana 解决方案',
    description: 'Enterprise-grade Solana blockchain solutions. Treasury management, payment rails, and more.',
    descriptionZh: '企业级 Solana 区块链解决方案。资金管理、支付通道等。',
    accentColor: '#00C2FF',
    icon: '🏢',
    forSale: true,
    isMain: false,
    features: [
      { title: 'Treasury Management', titleZh: '资金管理', desc: 'Enterprise SOL treasury and payment solutions.', descZh: '企业 SOL 资金管理和支付解决方案。', icon: '💰' },
      { title: 'UPEXI Integration', titleZh: 'UPEXI 集成', desc: 'Perfect domain for UPEXI-related Solana ventures.', descZh: 'UPEXI 相关 Solana 项目的完美域名。', icon: '🔗' },
      { title: 'Corporate Blockchain', titleZh: '企业区块链', desc: 'Solana solutions for enterprise adoption and compliance.', descZh: '面向企业采用和合规的 Solana 解决方案。', icon: '🏛️' },
    ],
  },
};

export const ALL_DOMAINS = Object.values(DOMAIN_CONFIGS);
export const SATELLITE_DOMAINS = ALL_DOMAINS.filter((d) => !d.isMain);
export const FOR_SALE_DOMAINS = ALL_DOMAINS.filter((d) => d.forSale);

export function getDomainConfig(domain: string): DomainConfig | undefined {
  return DOMAIN_CONFIGS[domain];
}

export function getCurrentDomain(): string {
  return process.env.NEXT_PUBLIC_SITE_DOMAIN ?? MAIN_DOMAIN;
}
