import type { PropsWithChildren } from 'react';

export const Modal = ({ children }: PropsWithChildren): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
    <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-6">
      {children}
    </div>
  </div>
);
