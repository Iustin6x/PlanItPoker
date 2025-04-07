export enum CardType {
  SEQUENTIAL = 'SEQUENTIAL',
  FIBONACCI = 'FIBONACCI',
  HOURS = 'HOURS',
  CUSTOM = 'CUSTOM'
}
export type CardValue = number | '?' | string;

export const PREDEFINED_CARD_SETS: Record<Exclude<CardType, 'CUSTOM'>, CardValue[]> = {
  SEQUENTIAL: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  FIBONACCI: ['0', '1', '2', '3', '5', '8', '13', '21', '34'],
  HOURS: ['0', '0.5', '1', '2', '3', '4', '5', '6', '7', '8']
};