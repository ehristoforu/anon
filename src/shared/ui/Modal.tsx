import type { PropsWithChildren } from 'react';

export const Modal = ({ children }: PropsWithChildren): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-5">{children}</div>
  </div>
);
