import { describe, expect, it } from 'vitest';

import { selectFieldsSupersededByTags } from './select-fields-superseded-by-tags';

describe('selectFieldsSupersededByTags', () => {
  const existing = [
    { id: 1, type: 'SIGNATURE', recipientId: 10 },
    { id: 2, type: 'SIGNATURE', recipientId: 11 },
    { id: 3, type: 'TEXT', recipientId: 10 },
  ];

  it('selects existing fields whose type and recipient a tag recreates', () => {
    expect(selectFieldsSupersededByTags(existing, [{ type: 'SIGNATURE', recipientId: 10 }])).toEqual([1]);
  });

  it('keeps fields of other types or recipients', () => {
    expect(selectFieldsSupersededByTags(existing, [{ type: 'SIGNATURE', recipientId: 12 }])).toEqual([]);
  });

  it('selects nothing when there are no tags', () => {
    expect(selectFieldsSupersededByTags(existing, [])).toEqual([]);
  });

  it('selects several fields for several tags', () => {
    const tagged = [
      { type: 'SIGNATURE', recipientId: 10 },
      { type: 'TEXT', recipientId: 10 },
    ];

    expect(selectFieldsSupersededByTags(existing, tagged)).toEqual([1, 3]);
  });
});
