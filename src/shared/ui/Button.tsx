import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button = ({ children, className = '', ...props }: Props): JSX.Element => (
  <button
    className={`rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 disabled:opacity-40 ${className}`}
    {...props}
  >
    {children}
  </button>
);
