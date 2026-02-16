你是资深全栈工程师 + 产品设计师。请严格按我提供的“网站布局设计”实现 buysolanas.com 的信息架构与页面骨架（先做可运行MVP）。

技术栈：
- Next.js App Router + TypeScript
- Tailwind CSS，暗色极简风格
- 数据：CoinGecko API（我有API Key），服务端请求并缓存60秒
- 内容：MDX（Learn/Blog/Docs/Notes）
- 社区：先用 Supabase（Auth + DB）或先用最简DB实现发帖/评论（可后续替换）
- 部署：Cloudflare Pages

必须实现的顶层导航与页面：
1) /  首页：Hero + 行情快看区 + Learn闯关入口 + Solutions四张案例卡 + Community最新提问 + News简讯 + Blog&Podcast精选
2) /prices 行情列表（搜索、列表字段：价格/24h%/市值/成交量/7d迷你走势）
3) /prices/[id] 币种详情页（价格卡+指标卡+简介+关联教程链接）
4) /learn 学习中心：Tabs = Docs / My Notes / YouTube / GitHub（每条内容卡片）
5) /learn/[slug] 内容页：TL;DR、目录、下一步阅读、去提问按钮、免责声明
6) /solutions 解决方案入口页：四分类（RWA太阳能、数字资产musicsforyou、NFT命盘八字、游戏工具）
7) /solutions/[category]/[slug] 案例页：问题-方案-架构-结果-风险提示-联系合作
8) /community 社区列表 + /community/new 发帖 + /community/[id] 帖子详情与评论
9) /news 市场最新信息流（可过滤）
10) /blog 与 /podcast 列表与详情页

SEO要求：
- sitemap.xml、robots.txt
- canonical 指向 buysolanas.com
- 每页 title/description/OpenGraph

交付：
- 给出项目目录结构
- 关键代码文件可运行
- .env.example（COINGECKO_API_KEY等）
- Cloudflare Pages 部署步骤
