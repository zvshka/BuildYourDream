import { IField } from '../lib/Field';

export const TEXT = 'TEXT';
export const NUMBER = 'NUMBER';
export const BOOL = 'BOOL';
export const LARGE_TEXT = 'LARGE_TEXT';
export const RANGE = 'RANGE';
export const SELECT = 'SELECT';

export const fieldTypes = [
  { value: TEXT, label: 'Текстовое' },
  { value: NUMBER, label: 'Числовое' },
  { value: BOOL, label: 'Булевое' },
  { value: LARGE_TEXT, label: 'Много текста' },
  { value: RANGE, label: 'Промежуток' },
  { value: SELECT, label: 'Выбор' },
];

export interface IComponentImage {
  base64: string;
  file: File | null;
  url?: string;
}

export interface ITemplate {
  id?: string;
  name: string;
  fields: IField[];
}

export interface IComponent {
  image?: IComponentImage;
  tier: number;
  pros: string[];
  cons: string[];

  [key: string]: any;
}
