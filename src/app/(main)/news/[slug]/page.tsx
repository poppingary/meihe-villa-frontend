import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getNewsItemBySlug, getAllNewsSlugs } from '@/services/news';
import { cdnUrl } from '@/lib/cdn';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Category display names mapping
const categoryNames: Record<string, string> = {
  event: '活動',
  announcement: '公告',
  exhibition: '展覽',
  restoration: '修復',
};

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = await getNewsItemBySlug(slug);

  if (!newsItem) {
    return {
      title: '找不到文章',
    };
  }

  return {
    title: newsItem.title_zh,
    description:
      newsItem.summary_zh ||
      (newsItem.content_zh?.slice(0, 160).trim() + '...'),
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const newsItem = await getNewsItemBySlug(slug);

  if (!newsItem) {
    notFound();
  }

  const content = newsItem.content_zh || newsItem.content || '';

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[40vh] min-h-[300px] bg-stone-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${cdnUrl(newsItem.featured_image) || cdnUrl('/images/news/default.jpg')})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="border-b border-stone-200 bg-white py-4">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-900">
              首頁
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-stone-900">
              最新消息
            </Link>
            <span>/</span>
            <span className="max-w-[200px] truncate text-stone-900">
              {newsItem.title_zh}
            </span>
          </nav>
        </Container>
      </section>

      {/* Article Content */}
      <article className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded bg-stone-100 px-2 py-1 font-medium text-stone-600">
                  {categoryNames[newsItem.category || ''] ||
                    newsItem.category ||
                    '消息'}
                </span>
                {newsItem.published_at && (
                  <span className="text-stone-400">
                    {new Date(newsItem.published_at).toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-bold text-stone-900 md:text-4xl">
                {newsItem.title_zh}
              </h1>
              {newsItem.title && newsItem.title !== newsItem.title_zh && (
                <p className="mt-2 text-lg text-stone-500">{newsItem.title}</p>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-stone prose-lg max-w-none">
              {content.split('\n\n').map((paragraph, index) => {
                // Check if it's a heading
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="mt-8 mb-4 text-xl font-bold text-stone-800">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                // Check if it's a list
                if (paragraph.includes('\n- ')) {
                  const lines = paragraph.split('\n');
                  const title = lines[0];
                  const items = lines.slice(1).filter((l) => l.startsWith('- '));
                  return (
                    <div key={index}>
                      {title && <p className="font-medium">{title}</p>}
                      <ul>
                        {items.map((item, i) => (
                          <li key={i}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                // Check if it contains images (Markdown format)
                const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
                if (imageRegex.test(paragraph)) {
                  const images: { alt: string; src: string }[] = [];
                  let match;
                  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
                  while ((match = regex.exec(paragraph)) !== null) {
                    images.push({ alt: match[1], src: match[2] });
                  }
                  return (
                    <div key={index} className="my-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                      {images.map((img, i) => (
                        <div key={i} className="overflow-hidden rounded-lg">
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="h-48 w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  );
                }
                // Check if it's a link
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
                const linkMatch = paragraph.match(linkRegex);
                if (linkMatch) {
                  const beforeLink = paragraph.substring(0, linkMatch.index);
                  const linkText = linkMatch[1];
                  const linkUrl = linkMatch[2];
                  const afterLink = paragraph.substring((linkMatch.index || 0) + linkMatch[0].length);
                  return (
                    <p key={index} className="leading-relaxed text-stone-600">
                      {beforeLink}
                      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">
                        {linkText}
                      </a>
                      {afterLink}
                    </p>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed text-stone-600">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-center">
              <Link href="/news">
                <Button variant="outline">返回最新消息</Button>
              </Link>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
