'use client';

import { VisitInfoForm } from '@/components/admin/forms';

export default function NewVisitInfoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">新增參觀資訊</h2>
        <p className="text-muted-foreground">建立新的參觀資訊區塊</p>
      </div>
      <VisitInfoForm isNew />
    </div>
  );
}
