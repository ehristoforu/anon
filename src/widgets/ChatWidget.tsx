import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DecryptedMessage, MessageRecord } from '../entities/message/model';
import { MessageItem } from '../features/chat/MessageItem';
import { MessageComposer } from '../features/chat/MessageComposer';
import { decryptText, encryptText } from '../shared/crypto/cryptoService';
import { fetchMessages, mergeMessages, pushMessage } from '../shared/api/gistClient';
import { POLLING_MAX_MS, POLLING_MIN_MS } from '../shared/constants/config';
import { useAdaptivePolling } from '../shared/hooks/useAdaptivePolling';

type Props = {
  username: string;
  seedPhrase: string;
  onLogout: () => void;
};

const decryptBatch = async (records: MessageRecord[], seedPhrase: string): Promise<DecryptedMessage[]> => {
  const decrypted: DecryptedMessage[] = [];
  for (const record of records) {
    const text = await decryptText(record.cipherText, seedPhrase, record.iv, record.salt);
    decrypted.push({ id: record.id, sender: record.sender, text, createdAt: record.createdAt });
  }
  return decrypted;
};

export const ChatWidget = ({ username, seedPhrase, onLogout }: Props): JSX.Element => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [rawMessages, setRawMessages] = useState<MessageRecord[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const raceGuard = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const sync = useCallback(async () => {
    const requestId = Date.now();
    raceGuard.current = requestId;
    const document = await fetchMessages();
    if (raceGuard.current !== requestId) {
      return;
    }
    const merged = mergeMessages(rawMessages, document.messages);
    const decrypted = await decryptBatch(merged, seedPhrase);
    if (raceGuard.current !== requestId) {
      return;
    }
    setRawMessages(merged);
    setMessages(decrypted);
    setError('');
    setLoading(false);
  }, [rawMessages, seedPhrase]);

  useEffect(() => {
    void sync().catch((syncError: unknown) => {
      const text = syncError instanceof Error ? syncError.message : 'Не удалось синхронизировать сообщения';
      setError(text.includes('decrypt') ? 'Неверная seed-фраза для этой комнаты.' : text);
      setLoading(false);
    });
  }, [sync]);

  useAdaptivePolling(
    async () => {
      await sync();
    },
    POLLING_MIN_MS,
    POLLING_MAX_MS,
    true
  );

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      try {
        const encrypted = await encryptText(text, seedPhrase);
        const record: MessageRecord = {
          id: crypto.randomUUID(),
          sender: username,
          createdAt: Date.now(),
          ...encrypted
        };
        const nextDoc = await pushMessage(record);
        setRawMessages(nextDoc.messages);
        const decrypted = await decryptBatch(nextDoc.messages, seedPhrase);
        setMessages(decrypted);
      } catch (sendError) {
        const textMessage = sendError instanceof Error ? sendError.message : 'Не удалось отправить сообщение';
        setError(textMessage);
      }
    },
    [seedPhrase, username]
  );

  const ordered = useMemo(() => [...messages].sort((a, b) => a.createdAt - b.createdAt), [messages]);

  return (
    <div className="mx-auto flex h-screen w-full max-w-4xl flex-col px-2 py-2 sm:px-4 sm:py-4">
      <div className="anim-fade-up flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-zinc-800 px-3 py-3 sm:px-5">
          <div>
            <h2 className="text-base font-bold sm:text-lg">Анонимная комната</h2>
            <p className="text-xs text-zinc-400">Пользователь: {username}</p>
          </div>
          <button className="rounded-xl border border-zinc-700 px-3 py-2 text-xs text-zinc-200 transition hover:border-zinc-500" onClick={onLogout} type="button">
            Выйти
          </button>
        </header>
        {error ? <div className="border-b border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">{error}</div> : null}
        <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 sm:px-5">
          {loading ? <p className="text-sm text-zinc-500">Синхронизация сообщений...</p> : null}
          {ordered.map((message) => (
            <MessageItem key={message.id} message={message} isOwn={message.sender === username} />
          ))}
        </div>
        <MessageComposer onSend={send} />
      </div>
    </div>
  );
};
