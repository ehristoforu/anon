import { describe, expect, it } from 'vitest';
import { generateSecurePhrase } from './securePhrase';

describe('generateSecurePhrase', () => {
  it('creates between 12 and 16 words', () => {
    const phrase = generateSecurePhrase();
    const count = phrase.split(' ').length;
    expect(count).toBeGreaterThanOrEqual(12);
    expect(count).toBeLessThanOrEqual(16);
  });
});
