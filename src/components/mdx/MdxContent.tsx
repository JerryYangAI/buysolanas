type MdxContentProps = {
  source: string; // raw markdown (kept for backward compat)
  html?: string; // pre-rendered HTML from build-time compilation
};

export default function MdxContent({ source, html }: MdxContentProps) {
  // Use pre-rendered HTML if available (Cloudflare-compatible)
  const content = html || source;
  const isHtml = !!html;

  if (isHtml) {
    return (
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Fallback: render raw markdown as-is (basic formatting)
  return (
    <div className="prose-custom">
      <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
    </div>
  );
}
