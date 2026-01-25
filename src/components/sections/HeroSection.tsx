import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryAction,
  secondaryAction,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[var(--dark-ochre)]',
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-[var(--dark-ochre)]/60" />
        </div>
      )}

      {/* Content */}
      <Container className="relative z-10 py-20 text-center">
        {subtitle && (
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--terracotta)]">
            {subtitle}
          </p>
        )}

        <h1 className="text-4xl font-bold text-[var(--warm-white)] sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>

        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--terracotta)] sm:text-xl">
            {description}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryAction && (
              <Link href={primaryAction.href}>
                <Button size="lg" variant="primary" className="bg-[var(--warm-white)] text-[var(--dark-ochre)] hover:bg-[var(--terracotta)]">
                  {primaryAction.label}
                </Button>
              </Link>
            )}
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button size="lg" variant="outline" className="border-[var(--warm-white)] text-[var(--warm-white)] hover:bg-[var(--warm-white)] hover:text-[var(--dark-ochre)]">
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
