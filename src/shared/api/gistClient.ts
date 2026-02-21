import type { ChatDocument, MessageRecord } from '../../entities/message/model';
import { ENV, GIST_FILENAME } from '../constants/config';

const gistUrl = `https://api.github.com/gists/${ENV.gistId}`;

const withNoCache = (url: string): string => `${url}?t=${Date.now()}`;

const readDocument = (raw: string | undefined): ChatDocument => {
  if (!raw) {
    return { version: 1, messages: [] };
  }
  const parsed = JSON.parse(raw) as ChatDocument;
  if (!Array.isArray(parsed.messages)) {
    return { version: 1, messages: [] };
  }
  return { version: 1, messages: parsed.messages };
};

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${ENV.token}`,
  'X-GitHub-Api-Version': '2022-11-28'
};

const ensureResponse = async (response: Response): Promise<Response> => {
  if (response.status === 403) {
    throw new Error('Превышен лимит GitHub API. Подождите и повторите попытку.');
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Ошибка запроса к GitHub API');
  }
  return response;
};

export const fetchMessages = async (): Promise<ChatDocument> => {
  const response = await fetch(withNoCache(gistUrl), { headers, method: 'GET', cache: 'no-store' });
  const payload = await (await ensureResponse(response)).json();
  return readDocument(payload.files?.[GIST_FILENAME]?.content);
};

export const mergeMessages = (existing: MessageRecord[], incoming: MessageRecord[]): MessageRecord[] => {
  const map = new Map(existing.map((message) => [message.id, message]));
  incoming.forEach((message) => map.set(message.id, message));
  return Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
};

export const pushMessage = async (nextMessage: MessageRecord): Promise<ChatDocument> => {
  const current = await fetchMessages();
  const merged = mergeMessages(current.messages, [nextMessage]);
  const response = await fetch(gistUrl, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify({ version: 1, messages: merged })
        }
      }
    })
  });
  await ensureResponse(response);
  return { version: 1, messages: merged };
};
