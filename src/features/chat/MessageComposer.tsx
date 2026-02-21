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
    <div className="border-t border-zinc-800 bg-black p-3">
      {showPicker ? (
        <div className="mb-2 overflow-hidden rounded-xl border border-zinc-700">
          <EmojiPicker onEmojiClick={(emojiData) => setValue((prev) => `${prev}${emojiData.emoji}`)} lazyLoadEmojis />
        </div>
      ) : null}
      <div className="flex gap-2">
        <button
          className="rounded-xl border border-zinc-700 px-3"
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
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm outline-none"
          placeholder="Message"
        />
        <Button onClick={() => void submit()} disabled={sending || !value.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};
