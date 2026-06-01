export default function LayoutHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 items-center gap-4 border-b border-(--Text)/12 bg-(--Layout)/85 px-4 py-3 backdrop-blur-md sm:px-5 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-(--LayoutSecundary)/80" />

      <div className="hidden flex-1 flex-col gap-1 sm:flex">
        <div className="h-2.5 w-24 rounded bg-(--LayoutSecundary)/70" />
        <div className="h-5 w-52 max-w-full rounded-md bg-(--LayoutSecundary)/80" />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-muted/20 p-1">
          <div className="h-8 w-8 rounded-lg bg-(--LayoutSecundary)/80" />
          <div className="mx-1 h-4 w-px bg-border/50" />
          <div className="h-8 w-8 rounded-lg bg-(--LayoutSecundary)/80" />
        </div>
        <div className="h-10 w-42 rounded-xl bg-(--LayoutSecundary)/80" />
      </div>
    </header>
  );
}