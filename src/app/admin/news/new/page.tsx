'use client';

import { NewsForm } from '@/components/admin/forms';

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">新增消息</h2>
        <p className="text-muted-foreground">發布新的新聞或公告</p>
      </div>
      <NewsForm isNew />
    </div>
  );
}
