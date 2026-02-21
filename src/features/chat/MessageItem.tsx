import { renderMarkdown } from '../../shared/utils/markdown';
import type { DecryptedMessage } from '../../entities/message/model';

type Props = {
  message: DecryptedMessage;
  isOwn: boolean;
};

export const MessageItem = ({ message, isOwn }: Props): JSX.Element => (
  <article
    className={`anim-slide-in max-w-[90%] rounded-2xl border px-4 py-3 sm:max-w-[82%] ${
      isOwn ? 'self-end border-zinc-500/80 bg-zinc-900' : 'border-zinc-800 bg-zinc-950'
    }`}
  >
    <p className="mb-2 text-xs text-zinc-400">{message.sender}</p>
    <div
      className="prose prose-invert prose-sm break-words [&_a]:text-zinc-200 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
    />
    <time className="mt-2 block text-right font-mono text-[10px] text-zinc-500">
      {new Date(message.createdAt).toLocaleTimeString('ru-RU')}
    </time>
  </article>
);
