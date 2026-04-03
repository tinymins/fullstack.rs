export default function WorkspaceRedirectSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="animate-pulse space-y-4 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6">
        <div className="h-5 w-1/3 rounded bg-[var(--ui-bg-hover)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--ui-bg-hover)]" />
        <div className="h-4 w-1/2 rounded bg-[var(--ui-bg-hover)]" />
      </div>
    </div>
  );
}
