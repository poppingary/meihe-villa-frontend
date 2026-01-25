import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  title?: string;
  items: TimelineItem[];
  className?: string;
}

export function TimelineSection({
  title,
  items,
  className,
}: TimelineSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <Container>
        {title && (
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-[var(--border)] md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'relative flex items-start gap-8 md:gap-0',
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2">
                  <div className="h-4 w-4 rounded-full border-4 border-[var(--brick-red)] bg-white" />
                </div>

                {/* Content */}
                <div
                  className={cn(
                    'ml-12 flex-1 md:ml-0 md:w-1/2',
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  )}
                >
                  <span className="inline-block rounded bg-[var(--terracotta)] px-3 py-1 text-sm font-semibold text-[var(--brick-red)]">
                    {item.year}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--wood-brown)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[var(--wood-brown-light)]">{item.description}</p>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
