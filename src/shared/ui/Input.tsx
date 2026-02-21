import type { InputHTMLAttributes } from 'react';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input
    className={`w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 px-4 py-3 text-sm text-zinc-100 outline-none ring-zinc-600/70 transition placeholder:text-zinc-500 focus:border-zinc-600 focus:ring ${className}`}
    {...props}
  />
);
