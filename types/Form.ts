import { IField } from '../lib/Field';

export const fieldTypes = [
  { value: 'TEXT', label: 'Текстовое' },
  { value: 'NUMBER', label: 'Числовое' },
  { value: 'BOOL', label: 'Булевое' },
  { value: 'LARGE_TEXT', label: 'Много текста' },
  { value: 'RANGE', label: 'Промежуток' },
  { value: 'SELECT', label: 'Выбор' },
];

export interface IPartImage {
  base64: string;
  file: File | null;
  url?: string;
}

export interface ICreateForm {
  name: string;
  tier: number;
  pros: string[];
  cons: string[];
  fields: IField[];
}

export interface ICreatePart extends ICreateForm {
  image: IPartImage;
  [key: string]: any
}
