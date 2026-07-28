// Shared raw-Tailwind classes for the calculator components (see DESIGN_DOCS.md).
// Labels are NOT css-uppercased: quantity symbols (c, n, V, M, m) are case-sensitive.
export const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export const labelText =
    'text-xs font-medium tracking-wider text-neutral-700';
export const labelHint = 'text-xs text-neutral-400';

const inputBase =
    'w-full bg-white border rounded-[4px] px-4 py-3 text-sm text-neutral-900 focus:outline-none transition-colors';
export const inputClass = `${inputBase} border-neutral-200 focus:border-black`;
export const inputErrorClass = `${inputBase} border-[#ef4444] focus:border-[#ef4444]`;

const btnBase =
    'px-6 py-3 text-xs font-medium tracking-wider uppercase rounded-[4px] transition-colors';
export const btnPrimary = `${btnBase} bg-black text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed`;
export const btnGhost = `${btnBase} bg-white text-black border border-neutral-200 hover:border-black`;

export const errorAlert =
    'flex items-center gap-3 border border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444] rounded-[4px] px-4 py-3 text-sm';
