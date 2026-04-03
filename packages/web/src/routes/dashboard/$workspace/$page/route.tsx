import { useParams } from "react-router";
import { PAGE_NAMES } from "@/components/dashboard/nav-config";

export default function DemoPageRoute() {
  const { page } = useParams<{ page: string }>();
  const pageName = (page && PAGE_NAMES[page]) ?? page ?? "未知页面";

  return (
    <div className="flex h-full items-center justify-center p-8">
      <p className="text-2xl font-medium text-[var(--ui-text-muted)]">
        已切换到&nbsp;
        <span className="text-[var(--ui-text)] font-semibold">{pageName}</span>
      </p>
    </div>
  );
}
