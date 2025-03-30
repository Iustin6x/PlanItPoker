export enum CardType {
  SEQUENTIAL = 'sequential',
  FIBONACCI = 'fibonacci',
  HOURS = 'hours',
  CUSTOM = 'custom'
}
export type CardValue = number | '?' | string;

export const PREDEFINED_CARD_SETS: Record<Exclude<CardType, 'custom'>, CardValue[]> = {
  sequential: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '34'],
  hours: ['0', '0.5', '1', '2', '3', '4', '5', '6', '7', '8']
};