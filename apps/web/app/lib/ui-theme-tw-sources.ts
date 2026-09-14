/** Classes do @DevsNossoLar/ui-theme (chat/layout) para o Tailwind do Next gerar CSS. */
export const UI_THEME_TW_SOURCES = `
-right-1
-top-1
absolute
absolute -bottom-0.5 -right-0.5 size-2.5
absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-(--Layout) text-(--ThemaAzul)
absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-(--ThemaVermelho) px-1 text-[9px] font-bold text-white
absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-(--ThemaVermelho) px-1 text-[9px] font-bold text-white
absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-(--ThemaVermelho) px-1.5 py-0.5 text-[10px] font-bold leading-4 text-white ring-2 ring-(--Layout)
absolute bottom-1.5 right-1.5 size-9 min-h-9 rounded-full p-0 text-(--Text)/65
absolute bottom-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-(--ThemaVerdeEscuro) text-white shadow-lg
absolute bottom-full left-0 z-50 mb-1 max-h-36 w-full overflow-y-auto rounded-lg border border-border/60 bg-(--Layout) py-1 shadow-lg
absolute bottom-full right-0 z-50 mb-2 w-72 rounded-2xl border border-border/60 bg-(--Layout) p-3 shadow-2xl
absolute inset-0 size-full object-cover
absolute inset-y-0 left-0 w-0.5 bg-(--ThemaVerdeEscuro)/70
absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border/60 bg-(--Layout) shadow-xl
absolute right-0 top-full mt-2 w-72 z-100 bg-(--Layout) backdrop-blur-md rounded-xl shadow-2xl border border-border/50 py-2 animate-in fade-in zoom-in-95 duration-200
absolute right-0 top-full z-50 mt-2 flex max-h-[min(420px,70vh)] w-[min(320px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border/60 bg-(--Layout) shadow-2xl
absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--Layout)
absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full text-(--Text)/50 transition-colors hover:bg-black/10 hover:text-(--Text)
absolute right-3 top-3 size-10 rounded-full bg-white/10 text-white
absolute right-3 top-3 z-50 inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-(--ThemaVermelho)/70 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-(--ThemaVermelho)
absolute top-1 right-1 z-20 hidden items-center gap-0.5 rounded-full border border-border/50 bg-(--Layout)/95 px-0.5 py-0.5 shadow-sm backdrop-blur-sm
active:scale-95
animate-in
animate-pulse
backdrop-blur-md
backdrop-blur-sm
bg-(--Layout) font-bold text-(--Text)
bg-amber-100/80
bg-amber-400/15
bg-amber-400/25
bg-amber-500/10
bg-black/10
bg-black/10 hover:bg-black/20
bg-black/10 text-black/80
bg-black/15
bg-black/15 text-black
bg-black/5
bg-black/85
bg-muted/70
bg-red-50
bg-red-500
bg-red-600
bg-red-600 p-6
bg-transparent
bg-white/10
block
block leading-tight
block max-w-full
block min-h-12 w-full resize-none rounded-3xl border-0 bg-(--LayoutSecundary) py-3 pl-4 pr-12 text-sm shadow-sm
block min-w-0 flex-1 truncate text-sm font-semibold leading-tight
block text-[10px] text-(--Text)/50
block text-[9px] font-bold uppercase tracking-wider text-(--Text)/45
block text-[9px] font-normal normal-case text-blue-600
block truncate text-[10px] font-normal text-(--Text)/80
block truncate text-[10px] opacity-80
block truncate text-[10px] text-(--Text)/60
block truncate text-[11px] font-semibold text-(--Text)/85
block truncate text-sm font-semibold
block truncate text-xs text-(--Text)/70
border
border-0
border-2
border-amber-400/40
border-amber-500/30
border-b
border-b border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-center text-xs text-amber-900
border-b border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100
border-b border-border/60 bg-(--Layout) px-4 py-3 backdrop-blur-sm md:px-6
border-black/10
border-border/30
border-border/40
border-border/50
border-border/60
border-border/70
border-dashed
border-l-2
border-none
border-r
border-red-300/50
border-t
bottom-1.5
bottom-2
bottom-4
bottom-full
chats
contents
cursor-not-allowed
cursor-not-allowed bg-black/5 opacity-60
cursor-pointer
custom-scrollbar
custom-scrollbar absolute inset-0 space-y-1 overflow-y-auto bg-(--LayoutSecundary) px-3 py-4 md:px-5
custom-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain
custom-scrollbar grid max-h-56 grid-cols-2 gap-2 overflow-y-auto
custom-scrollbar max-h-40 space-y-0.5 overflow-y-auto
custom-scrollbar max-h-56 space-y-2 overflow-y-auto
custom-scrollbar min-h-0 flex-1 overflow-y-auto
custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6
custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2 bg-(--Layout)
custom-scrollbar min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-y-contain px-2 text-[11px] text-(--Text)/85
custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain px-0.5 pb-1
custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-2
dark:bg-red-950/30
dark:text-amber-100
dark:text-red-100
dark:text-red-200
decoration-dotted
disabled:opacity-40
disabled:opacity-50
divide-border/40
divide-y
divide-y divide-border/40
duration-200
duration-300
ease-out
emoji
fade-in
fixed
fixed inset-0 flex items-center justify-center bg-black/85 p-4
fixed overflow-hidden rounded-xl border border-border/60 bg-(--Layout) py-1.5 text-sm shadow-2xl ring-1 ring-black/5
flex
flex animate-pulse items-center gap-2 rounded-md px-1.5 py-1.5
flex flex-1 md:h-full md:flex-none
flex flex-col
flex flex-col gap-1.5
flex flex-col items-center gap-1.5
flex flex-col items-center gap-2 px-2 py-4
flex flex-col items-center justify-center gap-3 p-6 text-center
flex flex-col items-center justify-center gap-4 px-4 py-6 text-center
flex flex-wrap gap-1.5
flex flex-wrap gap-2
flex gap-1.5
flex gap-2
flex h-16 w-full items-center px-4 sm:px-6 lg:px-8
flex h-[calc(100vh-4rem)] min-h-[420px] flex-col overflow-hidden md:h-[calc(100vh-4rem)]
flex h-[min(600px,calc(100svh-6rem))] w-[min(960px,calc(100vw-2rem))] flex-col overflow-hidden
flex h-dvh min-h-0 overflow-hidden
flex h-full min-h-0 flex-col border-r border-border/60 bg-(--Layout)/80 backdrop-blur-sm
flex h-full min-h-0 w-full shrink-0 flex-col border-r border-border/60 bg-(--Layout)/80 backdrop-blur-sm transition-[width] duration-200 md:w-[min(18rem,28vw)] md:max-w-[18rem]
flex items-center gap-1
flex items-center gap-1.5
flex items-center gap-2 border-b border-border/50 bg-(--ThemaVerdeEscuro)/10 px-3 py-2
flex items-center gap-2 border-t border-border/40 bg-(--LayoutSecundary)/50 px-3 py-2 text-xs
flex items-center gap-2 rounded-md bg-(--LayoutSecundary)/60 px-2 py-1.5 text-sm hover:underline
flex items-center gap-2 text-(--Text)/70
flex items-center gap-3
flex items-center justify-between
flex items-center justify-between gap-2
flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3
flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5
flex items-center justify-between gap-2 px-0.5
flex items-center justify-center
flex items-end gap-2
flex items-start gap-2 border-b border-(--ThemaAzul)/20 bg-(--ThemaAzul)/5 px-3 py-2 text-xs
flex items-start gap-2 border-b border-border/50 bg-(--ThemaVerdeEscuro)/10 px-2.5 py-2
flex items-start gap-2 pr-6
flex items-start justify-between gap-2
flex items-start justify-between gap-2 border-b border-(--ThemaVermelho)/25 bg-(--ThemaVermelho)/10 text-(--Text)
flex justify-center gap-3
flex justify-center pb-2
flex justify-end mr-20
flex min-h-0 flex-1 flex-col gap-1.5
flex min-h-0 flex-1 flex-col gap-2 overflow-hidden
flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-5
flex min-h-0 flex-1 flex-col justify-start px-2
flex min-h-0 flex-1 flex-col overflow-hidden
flex min-h-0 flex-1 flex-col overflow-hidden bg-(--LayoutSecundary)
flex min-h-0 flex-1 flex-col overflow-hidden py-2
flex min-h-0 flex-2 flex-col gap-2.5 overflow-hidden
flex min-h-0 flex-col overflow-hidden md:shrink-0 md:border-r md:border-border/60
flex min-h-0 min-w-0 flex-col overflow-hidden bg-(--Layout)/40 md:border-l md:border-border/40
flex min-h-0 overflow-hidden md:shrink-0
flex min-h-0 w-full flex-1 flex-col
flex min-h-10 w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors
flex min-h-13 w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors
flex min-w-0 flex-1 flex-col
flex min-w-0 items-center gap-1
flex min-w-0 items-center gap-2
flex min-w-0 items-center gap-2.5 rounded-xl border px-2.5 py-2
flex shrink-0 border-b border-border/50 md:hidden
flex shrink-0 flex-col gap-1
flex shrink-0 items-center gap-1
flex shrink-0 items-center gap-1.5
flex shrink-0 items-center gap-1.5 px-2
flex shrink-0 items-center justify-between border-b border-border/40 bg-(--Layout)/50 px-3 py-2.5
flex shrink-0 items-center justify-end border-b border-border/40
flex size-7 items-center justify-center rounded-md bg-(--ThemaVerdeEscuro)/15
flex size-7 shrink-0 items-center justify-center rounded-full bg-(--LayoutSecundary) text-[10px] font-bold text-(--Text)/70
flex size-7 shrink-0 items-center justify-center rounded-md bg-(--ThemaVerdeEscuro)/15
flex size-8 items-center justify-center rounded-lg bg-(--Layout)/90 shadow-sm ring-1 ring-border/40 transition-colors group-hover:bg-(--ThemaVerdeEscuro)/15
flex size-8 shrink-0 items-center justify-center rounded-full
flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-(--LayoutSecundary)/80
flex w-full flex-col gap-1 text-left
flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-(--ThemaVerdeEscuro)/15
flex w-full items-center gap-2.5 px-3 py-2 text-left text-(--Text)/90 hover:bg-(--LayoutSecundary)
flex w-full items-center gap-2.5 px-3 py-2 text-left text-destructive hover:bg-destructive/10
flex-1
flex-1 overflow-y-auto
flex-1 rounded-lg py-1 text-xs font-semibold
flex-1 rounded-md bg-(--ThemaVerdeEscuro)/80 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-(--ThemaVerdeEscuro)
flex-1 rounded-md bg-black/5 px-2 py-1.5 text-[11px] font-semibold text-(--Text)/70 hover:bg-black/10
flex-2
flex-col
flex-wrap
focus-visible:outline-none
focus-visible:ring-1
focus-visible:ring-2
focus-visible:ring-4
focus-visible:ring-primary/40
font-bold
font-extrabold
font-medium
font-medium text-foreground
font-medium text-red-900 dark:text-red-100
font-normal
font-semibold
font-semibold text-(--Text)/90
font-semibold text-(--ThemaAzul)
gap-0.5
gap-1
gap-1.5
gap-2
gap-2.5
gap-3
gap-4
gif
grid
grid gap-2
grid grid-cols-2 gap-2 sm:grid-cols-3
grid grid-cols-7 gap-1
grid-cols-2
grid-cols-7
group
group absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 translate-x-1/2 shrink-0 cursor-pointer items-center justify-center bg-transparent text-(--Text)/30 transition-all duration-200 ease-out hover:text-(--Text) active:scale-95 focus-visible:outline-none
group flex cursor-pointer items-center gap-3 rounded-xl p-1 pr-3 transition-colors duration-200 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
group flex h-full w-full flex-col items-center justify-between px-1 py-3 text-(--Text)/60 transition-colors hover:bg-(--LayoutSecundary)/50 hover:text-(--Text)
group relative flex w-full items-end gap-2
group-hover:-translate-x-0.5
group-hover:translate-x-0.5
h-10
h-10 w-10 rounded-xl bg-(--LayoutSecundary)/25
h-16
h-2
h-20
h-20 w-full object-cover
h-3
h-3 flex-1 rounded bg-(--LayoutSecundary)
h-3 w-3 border-2
h-4
h-5
h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5
h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5
h-8
h-9
h-9 w-9 border-2 border-(--ThemaVerdeEscuro) shadow-sm transition-colors group-hover:border-(--ThemaVerdeClaro)/30
h-dvh
h-full
h-full min-h-0
h-full min-h-0 w-full
h-full w-full flex flex-col gap-4
hasNotificationContent
hidden
hidden flex-col gap-0.5 text-left md:flex
hidden md:flex md:h-full
hover:bg-black/10
hover:bg-black/20
hover:bg-black/5
hover:bg-destructive/10
hover:bg-muted/50
hover:bg-red-500/10
hover:opacity-90
hover:scale-105
hover:text-red-950
hover:underline
hover:z-30
inline-flex
inline-flex items-center gap-0.5 rounded-full bg-muted/70 px-1.5 py-0.5 text-[9px] text-muted-foreground
inline-flex items-center gap-1
inline-flex items-center gap-1 font-bold text-destructive hover:underline
inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold
inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-(--ThemaVerdeEscuro) hover:bg-(--ThemaVerdeEscuro)/10
inline-flex items-center justify-center gap-2
inline-flex min-w-5 items-center justify-center rounded-full bg-(--ThemaVerdeEscuro) px-1.5 py-0.5 text-[10px] font-bold text-black
inline-flex min-w-5 items-center justify-center rounded-full bg-(--ThemaVermelho) px-1.5 py-0.5 text-[10px] font-bold text-white
inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold
inline-flex min-w-6 items-center justify-center rounded-full bg-(--ThemaVerdeEscuro) px-1.5 py-0.5 text-[10px] font-bold leading-none text-black
inline-flex size-7 items-center justify-center rounded-md text-(--Text)/50 hover:bg-(--LayoutSecundary)
inline-flex size-8 shrink-0 items-center justify-center rounded-lg
inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-(--Text)/60 hover:bg-(--LayoutSecundary) hover:text-(--Text)
inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--ThemaVerdeEscuro) text-black transition-opacity disabled:opacity-40
inline-flex w-full min-w-0 items-center gap-2 p-1
inset-0
inset-y-0
invisible
isDropdownOpen
italic
items-center
items-end
items-start
justify-between
justify-center
justify-end
justify-end pl-10
justify-start
justify-start pr-10
leading-4
leading-none
leading-relaxed
leading-tight
left-0
left-2
lg:px-8
line-clamp-2
line-clamp-2 text-xs opacity-80
line-clamp-2 text-xs opacity-85
line-clamp-2 text-xs text-(--Text)/65
max-h-36
max-h-40
max-h-40 w-full object-contain
max-h-56
max-h-64
max-h-64 max-w-full rounded-md object-contain
max-h-[90vh]
max-h-[90vh] max-w-[95vw] rounded-lg object-contain
max-w-40
max-w-40 truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80
max-w-40 truncate text-sm font-bold leading-none text-foreground tracking-tight
max-w-[12rem]
max-w-[95vw]
max-w-[min(220px,40vw)] text-right
max-w-full
max-w-md
max-w-md space-y-2
mb-0.5
mb-0.5 block truncate text-[10px] text-(--Text)/50
mb-0.5 flex min-w-0 items-center gap-2
mb-1
mb-1 text-[10px] font-semibold text-(--Text)/55
mb-1.5
mb-1.5 border-l-2 border-(--ThemaAzul)/40 pl-2 text-[11px] text-(--Text)/55
mb-1.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-(--Text)/45
mb-2
mb-2 flex gap-1
mb-2 flex items-center gap-2
mb-2 flex w-full items-start gap-2 rounded-lg border border-(--ThemaVerdeEscuro)/30 bg-(--ThemaVerdeEscuro)/10 px-3 py-2 text-sm shadow-sm
mb-2 flex w-full items-start gap-2 rounded-lg border border-red-300/50 bg-red-50 px-3 py-2 text-sm shadow-sm dark:bg-red-950/30
mb-2 w-full rounded-lg border border-border/50 bg-(--LayoutSecundary) px-2 py-1.5 text-xs
mb-3
md:border-border/40
md:border-border/60
md:border-l
md:border-r
md:flex
md:flex-none
md:flex-row
md:h-full
md:hidden
md:max-w-[18rem]
md:mx-4
md:px-4
md:px-5
md:px-6
md:shrink-0
min-h-0
min-h-0 flex-1 overscroll-y-contain
min-h-10
min-h-12
min-h-12 flex-1 text-sm font-semibold transition-colors
min-h-13
min-h-4
min-h-9
min-h-[140px]
min-h-[140px] flex-1 resize-y rounded-xl border border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/40 px-3 py-2.5 text-sm text-(--Text) outline-none placeholder:text-(--Text)/40 focus:border-(--ThemaVerdeEscuro)
min-h-[420px]
min-w-0
min-w-0 flex-1
min-w-0 flex-1 rounded-lg border border-border/60 bg-(--Layout) px-2 py-1.5 text-sm text-(--Text) outline-none focus-visible:ring-2 focus-visible:ring-(--ThemaVerdeEscuro)/40
min-w-0 flex-1 truncate text-base font-bold text-(--Text)/90
min-w-0 truncate
min-w-0 truncate text-sm font-semibold
min-w-4
min-w-5
min-w-6
ml-1
ml-1 opacity-70
ml-auto
ml-auto flex shrink-0 items-center gap-3
ml-auto rounded-md p-1 text-(--Text)/50 hover:bg-(--LayoutSecundary) hover:text-(--Text)
ml-auto shrink-0 rounded-md bg-(--LayoutSecundary) px-1.5 py-0.5 text-[10px] font-semibold uppercase text-(--Text)/65
mr-2
mr-2 flex items-center
mr-20
mt-0.5
mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400/25 text-amber-700
mt-0.5 size-3.5 shrink-0 text-(--ThemaAzul)
mt-0.5 size-3.5 shrink-0 text-(--ThemaVerdeEscuro)
mt-0.5 size-4 shrink-0 text-(--ThemaVerdeEscuro)
mt-0.5 size-4 shrink-0 text-red-600
mt-0.5 text-sm font-semibold
mt-0.5 text-sm font-semibold text-(--Text)/90
mt-0.5 text-xs text-muted-foreground
mt-0.5 text-xs text-red-800 dark:text-red-200
mt-0.5 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-(--Text)/75
mt-1
mt-1 flex flex-wrap gap-1
mt-1 flex min-h-4 flex-wrap items-center justify-end gap-1.5 text-[10px] text-(--Text)/50
mt-1 max-h-56 max-w-full rounded-md object-contain
mt-1 text-[10px] italic text-(--Text)/55
mt-1 text-[10px] text-(--Text)/65
mt-1 text-sm font-semibold
mt-1.5
mt-1.5 text-[10px] font-medium text-(--ThemaVerdeEscuro)
mt-2
mt-2 cursor-pointer rounded-md bg-(--ThemaVerdeEscuro) px-2.5 py-1 text-xs font-medium text-white hover:opacity-90
mt-2 flex items-center gap-2
mt-2 flex items-center justify-between gap-2
mt-2 overflow-hidden rounded-lg border border-(--ThemaVerdeEscuro)/30 bg-(--Layout) shadow-sm
mt-2 px-3 text-[10px] text-(--Text)/50
mt-2 rounded-lg bg-(--ThemaVerdeEscuro) px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90
mt-2 shrink-0 border-t border-(--Text)/10 bg-(--Layout) p-2
mt-2 text-center text-xs text-(--Text)/55
mt-2 text-xs text-(--ThemaAmarelo)/70
mt-2 text-xs text-destructive
mt-2.5
mt-2.5 flex flex-wrap gap-1.5 border-t pt-2.5
mt-3
mt-auto
mt-auto shrink-0 border-t border-border/50 pt-3
mx-0
mx-2
mx-2 border-t border-(--Text)/10 px-1 pb-2 pt-3
mx-2 h-4 w-px bg-(--Text)/10
mx-2 rounded-lg border border-dashed border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/60 px-3 py-3 text-xs text-(--Text)/60
mx-3
mx-3 mt-3 shrink-0 md:mx-4
mx-auto
mx-auto size-5
my-1
my-1 border-t border-border/50
my-3
normal-case
object-contain
object-cover
online
opacity-0
opacity-60
opacity-70
opacity-75
opacity-80
opacity-85
outline-none
overflow-hidden
overflow-hidden rounded-lg bg-(--LayoutSecundary)/70 ring-1 ring-border/50
overflow-hidden rounded-lg ring-1 ring-border/40 hover:ring-(--ThemaVerdeEscuro)
overflow-x-hidden
overflow-y-auto
overscroll-y-contain
p-0
p-0.5
p-1
p-2
p-3
p-4
p-6
pb-1
pb-2
pb-4
pl-10
pl-2
pl-4
pl-7
pointer-events-auto
pointer-events-auto flex w-full max-w-full flex-col
pointer-events-auto relative inline-flex size-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ThemaVerdeEscuro)/35 cursor-pointer
pointer-events-none
pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-(--Text)/40
pointer-events-none fixed bottom-2 right-4 z-[9999] flex max-w-[calc(100vw-2rem)] flex-col items-end justify-end
pr-10
pr-12
pr-2
pr-3
pr-6
pt-1
pt-2
pt-2.5
pt-3
px-0.5
px-1
px-1 mt-1 pt-1 border-t border-border/50
px-1 py-2 text-center text-[11px] text-(--Text)/55
px-1 py-2 text-xs text-(--Text)/55
px-1 text-[10px] font-bold uppercase tracking-widest text-(--Text)/50
px-1 text-[11px] text-(--ThemaVermelho)
px-1.5
px-2
px-2 py-1 text-[11px]
px-2 text-xs font-semibold text-(--Text)/70
px-2.5
px-2.5 py-1.5 text-xs
px-3
px-3 py-2 text-sm md:px-4
px-3 py-2 text-xs
px-3 py-3 border-b border-(--Text)/10 bg-transparent
px-4
px-4 py-8 text-center text-sm text-(--Text)/55
py-0.5
py-1
py-1.5
py-2
py-2 px-1
py-2 text-center text-xs text-(--Text)/50
py-2.5
py-3
py-4
py-4 text-center text-xs text-(--Text)/50
py-5
py-6
py-8
relative
relative flex h-16 shrink-0 items-center bg-(--Layout) border-b border-border/50
relative flex h-full shrink-0 flex-col border-r border-border/60 bg-(--LayoutSecundary)/30
relative flex min-h-0 flex-1 flex-col
relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row
relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--LayoutSecundary)/80 text-(--Text)/50 ring-1 ring-border/70
relative h-8 w-8 rounded-lg border-none bg-transparent shadow-none transition-colors hover:bg-muted/50
relative inline-flex size-8 items-center justify-center rounded-lg text-(--Text)/60 transition-colors hover:bg-(--LayoutSecundary) hover:text-(--Text)
relative max-w-[min(82%,32rem)] rounded-lg px-3 py-2
relative max-w-full
relative min-h-0 flex-1
relative min-w-0 flex-1
relative rounded-lg font-semibold transition-colors
relative rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-2.5 text-(--Text)/90 shadow-sm
relative shrink-0
relative z-10 my-3 flex justify-center
relative z-10 overflow-hidden rounded-xl border border-(--ThemaVerdeEscuro)/25 bg-(--Layout) shadow-sm
relative z-10 shrink-0 space-y-1.5 border-b border-border/40 px-2 pb-2
relative z-20 border-t border-border/60 bg-(--Layout) p-3 backdrop-blur-sm
relative z-40 w-full shrink-0 bg-(--Layout) backdrop-blur-md
relative z-50 shrink-0 bg-(--LayoutSecundary) backdrop-blur-md
relative z-60 flex h-dvh shrink-0 flex-col transition-[width] duration-300 ease-out
resize-none
resize-y
resize-y rounded-xl border border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/40 px-3 py-2.5 text-sm text-(--Text) outline-none placeholder:text-(--Text)/40 focus:border-(--ThemaVerdeEscuro)
right-0
right-1
right-1.5
right-2
right-3
right-4
ring-1
ring-2
ring-amber-400/70
ring-black/5
ring-border/40
ring-border/50
ring-border/70
rounded
rounded px-1.5 py-0.5 text-xs text-(--Text)/60 hover:bg-(--LayoutSecundary)
rounded-2xl
rounded-3xl
rounded-full
rounded-full bg-(--Layout)/80 px-3 py-0.5 text-[10px] font-semibold text-(--Text)/55 ring-1 ring-border/50
rounded-full border border-border/60 bg-(--Layout) px-3 py-1 text-xs text-(--Text)/70 hover:bg-(--LayoutSecundary)
rounded-full p-1 text-(--Text)/65 hover:bg-(--LayoutSecundary) hover:text-(--ThemaVerdeEscuro)
rounded-full p-1 text-(--Text)/70 hover:bg-(--LayoutSecundary) hover:text-(--Text)
rounded-full px-1 text-sm hover:bg-(--LayoutSecundary)
rounded-full px-1.5 py-0.5 text-[11px] ring-1
rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase
rounded-lg
rounded-lg bg-(--ThemaVerdeEscuro) px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50
rounded-lg bg-amber-100/80 ring-2 ring-amber-400/70
rounded-lg border border-dashed border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/60 px-3 py-3 text-xs text-(--Text)/60
rounded-lg px-3 py-1.5 text-xs text-(--Text)/60 hover:bg-(--LayoutSecundary)
rounded-md
rounded-md bg-black/10 px-2 py-0.5 text-[10px] font-semibold hover:bg-black/20
rounded-md p-1 text-(--Text)/50 hover:bg-(--LayoutSecundary)/60 hover:text-(--Text)
rounded-md p-1 text-(--Text)/50 hover:bg-black/5 hover:text-(--Text)/80
rounded-xl
rounded-xl bg-(--LayoutSecundary)/60 px-3 py-2.5 text-(--Text)/85
rounded-xl border border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/40 px-3 py-2.5 text-sm text-(--Text) outline-none placeholder:text-(--Text)/40 focus:border-(--ThemaVerdeEscuro)
rounded-xl border border-dashed border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/40 px-3 py-4 text-xs leading-relaxed text-(--Text)/65
rounded-xl border border-dashed border-(--LayoutSecundary)/80 bg-(--LayoutSecundary)/60 px-3 py-4 text-sm text-(--Text)/60
rounded-xl border border-dashed border-border/70 bg-(--LayoutSecundary)/60 p-6 text-center text-sm text-(--Text)/50
rounded-xl border px-3 py-3 transition-all
rounded-xl px-3 py-2 text-sm font-medium transition-colors
shadow-2xl
shadow-lg
shadow-none
shadow-sm
shadow-xl
shrink-0
shrink-0 border-t border-(--ThemaVerdeEscuro)/25 bg-(--ThemaVerdeEscuro)/5 px-3 py-3
shrink-0 rounded p-0.5 text-red-700 hover:text-red-950
shrink-0 text-[10px] tabular-nums text-(--Text)/85
shrink-0 text-[10px] text-(--Text)/50
shrink-0 text-muted-foreground transition-transform duration-300
shrink-0 text-xs text-(--Text)/55 hover:text-(--Text)
shrink-0 underline decoration-dotted hover:opacity-90
size-1.5
size-1.5 rounded-full bg-(--Text)/25
size-10
size-10 shrink-0 rounded-full object-cover
size-10 text-(--Text)
size-12
size-12 min-h-12 shrink-0 rounded-full bg-(--ThemaVerdeEscuro)/70 p-0 text-white hover:bg-(--ThemaVerdeEscuro)
size-12 min-h-12 shrink-0 rounded-full p-0
size-14
size-2
size-2 shrink-0 rounded-full bg-(--ThemaVerdeEscuro)
size-2.5
size-3
size-3.5
size-3.5 shrink-0 text-(--Text)/60
size-3.5 shrink-0 text-(--ThemaVerdeEscuro)
size-3.5 text-(--Text)/45
size-3.5 text-(--ThemaAzul)
size-3.5 text-(--ThemaVerdeEscuro)
size-4
size-4 animate-pulse
size-4 shrink-0
size-4 shrink-0 opacity-70
size-4 shrink-0 text-(--ThemaAzul)
size-4 shrink-0 text-(--ThemaVerdeEscuro)
size-4 text-(--ThemaVerdeEscuro)
size-5
size-6
size-7
size-7 rounded-full bg-(--LayoutSecundary)
size-8
size-8 shrink-0
size-8 shrink-0 rounded-full object-cover
size-8 shrink-0 text-(--Text)/50
size-9
size-9 rounded-lg text-sm font-semibold transition-colors
size-full
sm:grid-cols-3
sm:px-6
sm:w-auto
space-y-0.5
space-y-0.5 text-[11px] text-(--Text)/85
space-y-1
space-y-1.5
space-y-2
space-y-3
sr-only
sticky
sticky top-0 z-10 mb-1 flex items-center justify-between rounded-md bg-(--LayoutSecundary)/80 px-2 py-1 backdrop-blur-sm
sticky top-0 z-10 mb-1 flex w-full items-center justify-between rounded-md bg-(--LayoutSecundary)/80 px-2 py-1 backdrop-blur-sm transition-colors hover:bg-(--LayoutSecundary)
tabular-nums
text-(--Text)/50 hover:text-(--Text)
text-2xl
text-2xl font-extrabold text-(--Text)
text-[10px]
text-[10px] font-bold text-(--Text)/50 uppercase tracking-widest
text-[10px] font-bold uppercase tracking-wider text-(--Text)/55
text-[10px] font-bold uppercase tracking-wider text-(--Text)/85
text-[10px] font-bold uppercase tracking-widest text-(--Text)/50
text-[10px] font-bold uppercase tracking-widest text-(--Text)/55
text-[10px] font-bold uppercase tracking-widest text-amber-800/80
text-[10px] font-semibold uppercase tracking-wide text-(--Text)/45
text-[10px] italic text-(--ThemaAzul) animate-pulse
text-[10px] tabular-nums text-(--Text)/55
text-[10px] tabular-nums text-(--Text)/85
text-[10px] text-(--Text)/45
text-[10px] text-(--Text)/50
text-[11px]
text-[11px] font-bold uppercase tracking-widest text-(--Text)/55
text-[11px] font-semibold uppercase tracking-wide text-(--Text)/55
text-[11px] italic opacity-70
text-[11px] leading-relaxed text-(--Text)/70
text-[11px] uppercase font-extrabold text-(--Text)/60
text-[9px]
text-[9px] font-bold uppercase tracking-tighter bg-(--ThemaVermelho)/10 text-(--ThemaVermelho) px-1.5 py-0.5 rounded border border-(--ThemaVermelho)/20
text-amber-700
text-amber-800/80
text-amber-900
text-base
text-base font-semibold
text-base font-semibold text-(--ThemaVermelho)
text-black
text-black/80
text-blue-600
text-center
text-destructive
text-foreground
text-left
text-muted-foreground
text-muted-foreground group-hover:text-(--Text)
text-muted-foreground/80
text-red-500
text-red-600
text-red-700
text-red-800
text-red-900
text-right
text-sm
text-sm font-bold text-(--Text)/90
text-sm font-semibold text-(--Text)
text-sm text-(--Text)/50
text-white
text-xl
text-xl hover:bg-(--LayoutSecundary) rounded-lg p-1
text-xs
text-xs font-bold text-(--Text)
text-xs font-bold text-(--Text) truncate
text-xs font-bold text-(--Text)/80 uppercase tracking-widest
text-xs font-semibold text-(--ThemaVerdeEscuro)
text-xs text-(--Text)/60 hover:text-(--Text)
text-xs text-(--Text)/65
text-xs text-(--Text)/75
thread
top-0
top-1
top-1.5
top-1/2
top-11
top-2
top-3
top-full
tracking-tight
tracking-tighter
tracking-wide
tracking-wider
tracking-widest
transition-[width]
transition-all
transition-colors
transition-opacity
transition-transform
translate-x-1/2
truncate
truncate font-medium
truncate text-(--Text)/60
truncate text-(--Text)/70
truncate text-[10px] font-bold uppercase tracking-wider text-(--Text)/85
truncate text-[11px] font-semibold text-(--Text)/85
truncate text-[11px] opacity-75
truncate text-[11px] text-(--Text)/70
truncate text-sm font-semibold text-(--Text)/90
truncate text-xs font-semibold
underline
uppercase
w-0.5
w-10
w-2
w-3
w-5
w-72
w-8
w-9
w-[12rem]
w-[12rem] max-w-[12rem]
w-full
w-full px-3 py-1.5 text-left text-sm hover:bg-(--LayoutSecundary)
w-full resize-none rounded-xl border border-border/60 bg-(--Layout) px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ThemaVerdeEscuro)
w-full rounded-lg border border-border/50 bg-(--LayoutSecundary) px-3 py-1.5 text-sm
w-full rounded-md border-0 bg-(--LayoutSecundary) py-1.5 pr-2 pl-7 text-[11px] text-(--Text)/85 placeholder:text-(--Text)/45 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--ThemaVerdeEscuro)
w-full rounded-xl bg-(--LayoutSecundary)/60 px-3 py-2.5 text-left text-(--Text)/85 transition-colors hover:bg-(--LayoutSecundary)/80
w-full rounded-xl border border-border/30 bg-(--LayoutSecundary)/80 px-3 py-2.5 text-sm text-(--Text)/85 shadow-sm placeholder:text-(--Text)/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ThemaVerdeEscuro)/40
w-full sm:w-auto
w-full text-left px-3 py-2 text-sm text-(--Text)/70 hover:bg-muted/50 rounded-lg flex items-center justify-between group transition-colors cursor-not-allowed
w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors font-medium
w-px
whitespace-pre-wrap
whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-(--Text)/80
wrap-break-word
z-0
z-0 hover:z-30
z-10
z-100
z-20
z-40
z-50
z-60
z-[9999]
zoom-in-95
` as const;
