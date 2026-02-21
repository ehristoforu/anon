import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '../../shared/ui/Button';

type Props = {
  onSend: (value: string) => Promise<void>;
};

export const MessageComposer = ({ onSend }: Props): JSX.Element => {
  const [value, setValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (): Promise<void> => {
    if (!value.trim() || sending) {
      return;
    }
    setSending(true);
    await onSend(value.trim());
    setValue('');
    setSending(false);
  };

  return (
    <div className="border-t border-zinc-800 bg-black/80 p-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:p-3">
      {showPicker ? (
        <div className="mb-2 overflow-hidden rounded-2xl border border-zinc-700">
          <EmojiPicker onEmojiClick={(emojiData) => setValue((prev) => `${prev}${emojiData.emoji}`)} lazyLoadEmojis />
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <button
          className="h-11 rounded-2xl border border-zinc-700 px-3 text-lg transition hover:border-zinc-500"
          onClick={() => setShowPicker((prev) => !prev)}
          type="button"
        >
          😀
        </button>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void submit();
            }
          }}
          className="h-11 flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-sm outline-none transition focus:border-zinc-600"
          placeholder="Напишите сообщение"
        />
        <Button onClick={() => void submit()} disabled={sending || !value.trim()} className="h-11 px-4 py-0">
          Отправить
        </Button>
      </div>
    </div>
  );
};
