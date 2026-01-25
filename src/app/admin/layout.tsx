import { AuthProvider } from '@/components/admin/auth';
import { AdminLayoutClient } from '@/components/admin/layout/AdminLayoutClient';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'CMS 後台管理 | 梅鶴山莊',
  description: '梅鶴山莊後台管理系統',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <Toaster />
    </AuthProvider>
  );
}
