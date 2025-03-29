export type UUID = string & { readonly __brand: unique symbol };
export type RoomID = UUID & { readonly __roomBrand: unique symbol };
export type StoryID = UUID & { readonly __storyBrand: unique symbol };

export function generateUUID(): UUID {
    return crypto.randomUUID() as UUID;
  }