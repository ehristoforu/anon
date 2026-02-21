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
      const text = syncError instanceof Error ? syncError.message : 'Unable to sync';
      setError(text.includes('decrypt') ? 'Invalid seed phrase for this room.' : text);
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
        const textMessage = sendError instanceof Error ? sendError.message : 'Unable to send message';
        setError(textMessage);
      }
    },
    [seedPhrase, username]
  );

  const ordered = useMemo(() => [...messages].sort((a, b) => a.createdAt - b.createdAt), [messages]);

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 p-3">
        <div>
          <h2 className="text-lg font-semibold">Anonymous room</h2>
          <p className="text-xs text-zinc-400">{username}</p>
        </div>
        <button className="text-xs text-zinc-300" onClick={onLogout} type="button">
          Logout
        </button>
      </header>
      {error ? <div className="border-b border-red-900 bg-red-950/40 p-2 text-xs text-red-300">{error}</div> : null}
      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {loading ? <p className="text-sm text-zinc-500">Syncing...</p> : null}
        {ordered.map((message) => (
          <MessageItem key={message.id} message={message} isOwn={message.sender === username} />
        ))}
      </div>
      <MessageComposer onSend={send} />
    </div>
  );
};
