'use client';

import { TimelineForm } from '@/components/admin/forms';

export default function NewTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">新增時間軸事件</h2>
        <p className="text-muted-foreground">建立新的歷史事件</p>
      </div>
      <TimelineForm isNew />
    </div>
  );
}
