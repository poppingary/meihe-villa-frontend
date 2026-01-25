import { AuthProvider } from '@/components/admin/auth';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
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
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="pl-64">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </AuthProvider>
  );
}
