export type CardType = 'sequential' | 'fibonacci' | 'hours' | 'custom';
export type CardValue = number | '?';

export const CARD_SETS: Record<Exclude<CardType, 'custom'>, CardValue[]> = {
  sequential: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  fibonacci: [0, 1, 2, 3, 5, 8, 13, 21, 34],
  hours: [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8]
};