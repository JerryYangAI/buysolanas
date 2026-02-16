import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Investment-related keywords that trigger safety interception
const BLOCKED_PATTERNS =
  /买入|卖出|抄底|投资建议|should\s*i\s*buy|when\s*to\s*buy|buy\s*now|sell\s*now|price\s*predict|should\s*i\s*invest|预测|点位|涨到|跌到|all\s*in|逃顶|合约|杠杆|leverage|pump|dump/i;

type ContentEntry = {
  type: 'course' | 'glossary';
  slug: string;
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  keywords: string;
};

// Static search index — Edge-safe (no fs/path)
// Manually maintained to match content/ directory
// In production, a build script could auto-generate this
const SEARCH_INDEX: ContentEntry[] = [
  {
    type: 'course',
    slug: 'lesson-1',
    titleEn: 'What Is Solana?',
    titleZh: '什么是 Solana？',
    descEn: 'Your first step into the Solana ecosystem. Learn what makes Solana unique.',
    descZh: '踏入 Solana 生态的第一步。了解 Solana 的独特之处。',
    keywords: 'solana blockchain speed cost energy fast cheap transaction nft dapp wallet 区块链 速度 成本 交易',
  },
  {
    type: 'glossary',
    slug: 'solana',
    titleEn: 'Solana',
    titleZh: 'Solana',
    descEn: 'A high-performance blockchain platform for fast, low-cost transactions.',
    descZh: '一个高性能区块链平台，专为快速低成本交易而设计。',
    keywords: 'solana sol token proof of history poh smart contract validator staking 验证者 质押 智能合约',
  },
];

function searchContent(query: string, locale: string): ContentEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = SEARCH_INDEX.map((entry) => {
    const searchable = [
      entry.titleEn,
      entry.titleZh,
      entry.descEn,
      entry.descZh,
      entry.keywords,
    ]
      .join(' ')
      .toLowerCase();

    let score = 0;
    for (const term of terms) {
      const titleField = locale === 'zh-CN' ? entry.titleZh : entry.titleEn;
      if (titleField.toLowerCase().includes(term)) score += 10;
      if (entry.keywords.includes(term)) score += 5;
      if (searchable.includes(term)) score += 2;
    }
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.entry);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const locale = typeof body.locale === 'string' ? body.locale : 'en';
  const isZh = locale === 'zh-CN';

  if (!message || message.length > 500) {
    return NextResponse.json({ error: 'invalid_message' }, { status: 400 });
  }

  // Safety interception: block investment advice
  if (BLOCKED_PATTERNS.test(message)) {
    return NextResponse.json({
      type: 'blocked',
      message: isZh
        ? '我无法提供投资建议。请查阅 /security 了解风险。'
        : 'I cannot provide investment advice. Please visit /security to learn about risks.',
      links: [
        {
          type: 'course',
          slug: 'lesson-1',
          title: isZh ? '什么是 Solana？' : 'What Is Solana?',
        },
      ],
    });
  }

  // Search local content index
  const results = searchContent(message, locale);

  if (results.length > 0) {
    return NextResponse.json({
      type: 'results',
      message: isZh
        ? '我找到了以下相关内容，希望对你有帮助：'
        : 'I found some relevant content that might help:',
      links: results.map((r) => ({
        type: r.type,
        slug: r.slug,
        title: isZh ? r.titleZh : r.titleEn,
      })),
    });
  }

  // No results — fallback with course recommendation
  return NextResponse.json({
    type: 'fallback',
    message: isZh
      ? '暂未找到相关内容。你可以尝试浏览我们的课程或术语表，或者在提问广场提交你的问题。'
      : "I couldn't find specific content for that. Try browsing our Course or Glossary, or submit your question in the Ask page.",
    links: [
      {
        type: 'course',
        slug: 'lesson-1',
        title: isZh ? '什么是 Solana？' : 'What Is Solana?',
      },
    ],
  });
}
