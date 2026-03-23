import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Quiz from './Quiz';

const components = {
  Quiz,
};

type MdxContentProps = {
  source: string;
};

export default function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose-custom">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
