import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true
});

export const renderMarkdown = (input: string): string =>
  DOMPurify.sanitize(marked.parse(input, { async: false }) as string, {
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i
  });
