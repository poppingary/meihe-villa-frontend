import { AuthProvider } from '@/components/admin/auth';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-muted/30">
        {children}
      </div>
    </AuthProvider>
  );
}
