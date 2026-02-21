import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button = ({ children, className = '', ...props }: Props): JSX.Element => (
  <button
    className={`rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition duration-300 hover:-translate-y-0.5 hover:border-zinc-500 hover:shadow-[0_8px_24px_rgba(255,255,255,0.1)] disabled:opacity-40 disabled:hover:translate-y-0 ${className}`}
    {...props}
  >
    {children}
  </button>
);
