import type { InputHTMLAttributes } from 'react';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input
    className={`w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-zinc-700 transition focus:ring ${className}`}
    {...props}
  />
);
