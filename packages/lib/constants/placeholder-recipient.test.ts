import { describe, expect, it } from 'vitest';

import { getPlaceholderRecipientEmail, isTemplateRecipientEmailPlaceholder } from './placeholder-recipient';

describe('placeholder recipient', () => {
  it('uses a reserved .invalid address', () => {
    expect(getPlaceholderRecipientEmail(1)).toBe('recipient.1@placeholder.invalid');
  });

  it('detects what it generates', () => {
    expect(isTemplateRecipientEmailPlaceholder(getPlaceholderRecipientEmail(12))).toBe(true);
  });

  it('still detects the stock address on older envelopes', () => {
    expect(isTemplateRecipientEmailPlaceholder('recipient.1@documenso.com')).toBe(true);
    expect(isTemplateRecipientEmailPlaceholder('Recipient.3@Documenso.com')).toBe(true);
  });

  it('does not flag real addresses', () => {
    expect(isTemplateRecipientEmailPlaceholder('alice@example.com')).toBe(false);
    expect(isTemplateRecipientEmailPlaceholder('recipient@example.com')).toBe(false);
    expect(isTemplateRecipientEmailPlaceholder('recipient.1@example.com')).toBe(false);
  });
});
