// paperrocket-sign: placeholder recipients (created by {{tags}} and template placeholders) use a reserved address, so a
// real mailbox can never be sent to by mistake. RFC 2606 reserves .invalid.
export const PLACEHOLDER_RECIPIENT_DOMAIN = 'placeholder.invalid';

export const getPlaceholderRecipientEmail = (index: number) => `recipient.${index}@${PLACEHOLDER_RECIPIENT_DOMAIN}`;

// Also matches the stock Documenso address, so envelopes and templates made before this change stay blocked.
export const TEMPLATE_RECIPIENT_EMAIL_PLACEHOLDER_REGEX = /recipient\.\d+@(placeholder\.invalid|documenso\.com)/i;

export const isTemplateRecipientEmailPlaceholder = (email: string) => {
  return TEMPLATE_RECIPIENT_EMAIL_PLACEHOLDER_REGEX.test(email);
};
