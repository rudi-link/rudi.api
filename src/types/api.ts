export type Manual = {
  name: string;
  prompts: {
    key: string;
    type: TypeApi;
  }[];
  isPrivate: boolean;
  count: number;
};

export type TypeApi = 'name' | 'image' | 'date' | 'phone' | 'word' | 'number' | 'city' | 'lorem';

export type Auto = {
  name: string;
  prompt: string;
  isPrivate: boolean;
};
