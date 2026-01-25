import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50">
      <Container>
        <div className="text-center">
          <p className="text-9xl font-bold text-stone-200">404</p>
          <h1 className="mt-4 text-3xl font-bold text-stone-900 md:text-4xl">
            頁面不存在
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            抱歉，您要找的頁面不存在或已被移除。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button>返回首頁</Button>
            </Link>
            <Link href="/architecture">
              <Button variant="outline">瀏覽建築</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
