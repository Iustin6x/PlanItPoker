export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type RoomID = UUID & { readonly __roomBrand: unique symbol };
export type StoryID = UUID & { readonly __storyBrand: unique symbol };

export function generateUUID(): UUID {
    return crypto.randomUUID() as UUID;
  }


  export function isUUID(value: string): value is UUID {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(value);
  }

declare const __brand: unique symbol;
