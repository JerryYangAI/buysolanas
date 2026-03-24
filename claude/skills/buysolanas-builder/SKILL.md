---
name: buysolana-builder
description: 用于从零开发和维护 buysolanas.com（Solana 新手教育社区）。当用户要求创建页面、处理 MDX 内容、集成 CoinGecko API 或配置 Cloudflare 部署时，必须加载此技能。
---

# 指令 (Instructions)

你现在是 buysolanas.com 的主架构师，必须严格遵守以下开发规范：

## 1. 技术架构约束
- **核心框架**：Next.js 14+ (App Router) + TypeScript。
- **国际化 (i18n)**：
    - 仅支持 `en` 和 `zh-CN`。默认语言为 `en`。
    - 路由必须包含 locale 前缀（例如 `/en/course` 或 `/zh-CN/course`）。
    - 严禁在组件中硬编码 UI 文本，必须使用 `messages/*.json` 并通过 `next-intl` 或同等方案提取。
- **部署环境**：Cloudflare Pages。
    - 所有 API 路由必须显式声明 `export const runtime = 'edge';`。
    - 使用 `@cloudflare/next-on-pages` 进行构建。

## 2. 内容与 SEO 规则
- **MDX 管理**：课程 (`/course`)、术语表 (`/glossary`) 和博客内容必须使用 MDX 文件。
- **原创性检查**：禁止从 solana.com 或其他竞品复制长篇文字，必须使用面向新手的原创口吻重写。
- **SEO 自动化**：
    - 每个页面必须包含 `metadata` 对象（title, description, openGraph）。
    - 必须自动维护 `sitemap.xml` 和 `robots.txt`。
    - 确保 `canonical` 链接包含正确的协议和语言路径。

## 3. 业务逻辑规则
- **行情数据 (Prices)**：
    - 必须从服务端发起请求，使用 `unstable_cache` 或类似机制设置 60 秒缓存。
    - 严禁在客户端暴露 `COINGECKO_API_KEY`。
- **安全红线**：
    - 遇到任何“买入/卖出、抄底、投资建议”等提问，必须触发拒绝逻辑。
    - 统一回复：“我无法提供投资建议。请查阅 /security 了解风险。”并附带免责声明链接。
- **社区功能**：提问表单提交至 Supabase，确保基本的频率限制（Rate Limiting）。

## 4. UI/UX 设计语言
- **风格**：暗色极简（SpaceX 风格），背景使用深色渐变或纯黑，文字使用高对比度灰色/白色。
- **交互**：移动端优先，所有交互元素必须符合触摸操作规范。

## 5. 体积与性能红线（Cloudflare Pages 25MB 硬限制）

此章节为最高优先级约束。违反任何一条都可能导致部署失败。

### 5.1 严禁本地存储大资源
- `public/` 文件夹下**单个文件不得超过 1MB**。
- 图片、视频、字体等大型媒体资源**必须托管在外部 CDN 或 Cloudflare R2**。
- 在 MDX 中引用图片时，使用外部 URL 或 `next/image` + WebP 压缩 + 尺寸限制（最大宽度 1200px）。

### 5.2 精简依赖库
- 引入**任何** NPM 包前，必须评估其打包体积（可用 bundlephobia.com 查询）。
- 优先选择轻量替代品：`date-fns` > `moment`，`lucide-react` > `react-icons` 全量。
- 严禁安装包含大量 polyfill 或全量打包的库。

### 5.3 强制代码分割
- 大型客户端组件（如 ChatWidget、Quiz）必须使用 `next/dynamic` 进行动态导入。
- 首页 First Load JS 必须保持最小化。
- 仅在需要时加载 `'use client'` 组件。

### 5.4 静态内容优化
- MDX 内容中的图片必须使用 `next/image` 并启用 WebP 转换。
- 禁止在 MDX 中内联 Base64 编码的大图。

### 5.5 部署前预检（每次 build 后强制执行）
```bash
npm run build && du -sh .next
```
- **安全线**：.next 总体积 < 15MB
- **警戒线**：.next 总体积 15–20MB → 立即审查并瘦身
- **红线**：.next 总体积 > 20MB → **停止开发**，优先执行体积优化

### 5.6 Tree Shaking 规范
- 所有导入必须使用**命名导入**（named imports），禁止 `import * as`。
- 示例：`import { Menu, X } from 'lucide-react'` ✅，`import * as Icons from 'lucide-react'` ❌
- 确保每个模块只导出被使用的函数/组件，避免 barrel exports 导致的打包膨胀。

## 6. 工作流执行顺序
1. **修改前**：先列出受影响的文件列表并简述修改计划。
2. **修改中**：保持函数小型化，优先使用功能组件。
3. **修改后**：自动运行 `npm run build && du -sh .next` 以验证 Cloudflare 兼容性和体积。