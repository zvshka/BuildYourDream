export const fieldTypes = [
  { value: 'TEXT', label: 'Текстовое' },
  { value: 'NUMBER', label: 'Числовое' },
  { value: 'BOOL', label: 'Булевое' },
  { value: 'LARGE_TEXT', label: 'Много текста' },
  { value: 'RANGE', label: 'Промежуток' },
  { value: 'SELECT', label: 'Выбор' },
] as const;

const values = fieldTypes.map((field) => field.value);

export type FieldTypes = typeof values[number];
export type FieldValues = number | string | [number, number] | boolean;

export interface IPartImage {
  base64: string;
  file: File | null;
  url?: string;
}

export interface IFormValues {
  tier: number;
  pros: string[];
  cons: string[];
  image: IPartImage;

  [name: string]: any;
}
