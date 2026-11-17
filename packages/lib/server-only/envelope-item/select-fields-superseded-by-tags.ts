// paperrocket-sign: Replace PDF, tags win.
type ExistingField = { id: number; type: string; recipientId: number };
type TaggedField = { type: string; recipientId: number };

/**
 * Ids of existing fields that a replacement PDF's placeholder tags create again.
 * A field has no marker for "made by a tag", so a (type, recipientId) pair is the rule.
 */
export const selectFieldsSupersededByTags = (existing: ExistingField[], tagged: TaggedField[]): number[] => {
  const pairs = new Set(tagged.map((field) => `${field.type}:${field.recipientId}`));

  return existing.filter((field) => pairs.has(`${field.type}:${field.recipientId}`)).map((field) => field.id);
};
