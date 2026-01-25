import { HeritageForm } from '@/components/admin/forms';

export default function NewHeritagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">新增古蹟景點</h2>
        <p className="text-muted-foreground">建立新的古蹟景點資料</p>
      </div>
      <HeritageForm isNew />
    </div>
  );
}
