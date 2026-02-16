
# buysolanas.com 产品需求文档 (PRD)

## 1. 项目愿景 (Product Vision)

**定位**：面向纯新手的 Solana 极简教育社区。
**核心价值**：通过 10 分钟入门和 7 关课程，消除用户对加密货币的恐惧，并提供实时行情与问答社区。
**调性**：暗色极简（SpaceX 风格）、专业、安全、移动端优先。

---

## 2. 核心技术栈 (Tech Stack)

* **框架**：Next.js 14+ (App Router)
* **语言**：TypeScript
* **样式**：Tailwind CSS
* **内容**：MDX (用于课程、博客、术语表)
* **行情**：CoinGecko API (Server-side fetch + 60s cache)
* **数据库**：Supabase (用于 /ask 表单和 /community 问答)
* **部署**：Cloudflare Pages (使用 `@cloudflare/next-on-pages`)
* **国际化**：多语言支持 (`en` / `zh-CN`)，路由驱动

---

## 3. 页面路由与功能设计

| 路由路径 | 页面名称 | 核心功能与内容 |
| --- | --- | --- |
| `/` | **首页** | Hero Section: "Learn Solana, safely."；Solana 实时价格卡片；3个快速入口按钮。 |
| `/start` | **10分钟入门** | 极简短文，介绍 Solana 核心优势，引导至课程。 |
| `/course` | **课程列表** | 展示 7 关课程进度条与标题。 |
| `/course/[step]` | **课程详情** | MDX 渲染；侧边目录；文末小测验 (Mini Quiz)；免责声明。 |
| `/glossary` | **术语词典** | A-Z 列表；实时搜索框；热门术语推荐。 |
| `/glossary/[term]` | **术语详情** | 深度定义；代码/应用示例；相关阅读推荐。 |
| `/prices` | **实时行情** | 展示 SOL/BTC/ETH 价格、涨跌幅、市值（每 60 秒刷新）。 |
| `/ask` | **提问广场** | 用户提交表单（钱包类型、遇到的问题等），数据入库 Supabase。 |
| `/community` | **问答社区** | 展示用户提问与官方/社区回复的列表。 |

---

## 4. 专项模块需求

### 4.1 智能助手 (Chat Widget)

* **形态**：右下角悬浮窗。
* **逻辑**：优先检索 `/course` 和 `/glossary` 的内容并给出链接。
* **安全防线**：
* **禁区**：禁止预测币价、禁止建议买卖点、禁止评价具体代币好坏。
* **兜底**：遇到此类问题统一回复：“我无法提供投资建议。请查阅 /security 了解风险。”



### 4.2 SEO 策略

* **动态生成**：`sitemap.xml` 和 `robots.txt`。
* **元数据**：每个页面必须有唯一的 `title`、`description` 和 OpenGraph 封面图。
* **规范化**：所有页面使用 `canonical` 标签指向 `buysolanas.com`。
* **多语言 SEO**：设置 `hreflang` 标签，确保搜索引精准推送中/英文版。

---

## 5. 开发约束 (Hard Rules for AI)

1. **原创性**：严禁直接抓取 solana.com 或其他竞品的长段文字，必须以“向新手解释”的口吻重写。
2. **安全第一**：涉及资金操作（钱包、转账）的页面，必须在显著位置标记风险提示。
3. **性能**：首页 Lighthouse 跑分必须 > 90；图片必须使用 `next/image` 优化。
4. **国际化**：**严禁**在组件内硬编码中文或英文，所有字符串必须提取至 `messages/*.json`。

---

## 6. 环境变量清单 (.env.example)

```bash
COINGECKO_API_KEY= # 你的 API Key
SUPABASE_URL=      # 社区数据存储
SUPABASE_ANON_KEY= # 匿名访问 Key
NEXT_PUBLIC_BASE_URL=https://buysolanas.com

```

---

## 7. 部署步骤 (Cloudflare Pages)

1. 在根目录配置 `wrangler.toml`。
2. 安装插件：`npm install -D @cloudflare/next-on-pages`。
3. 构建命令：`npx @cloudflare/next-on-pages`。
4. 在 Cloudflare 控制台关联 GitHub 仓库，选择 Next.js 预设。

---

