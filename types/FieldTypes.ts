export const TEXT = 'TEXT';
export const NUMBER = 'NUMBER';
export const BOOL = 'BOOL';
export const LARGE_TEXT = 'LARGE_TEXT';
export const RANGE = 'RANGE';
export const SELECT = 'SELECT';
export const DEPENDS_ON = 'DEPENDS_ON';
export const fieldTypes = [
  { value: TEXT, label: 'Текстовое' },
  { value: NUMBER, label: 'Числовое' },
  { value: BOOL, label: 'Булевое' },
  { value: LARGE_TEXT, label: 'Много текста' },
  { value: RANGE, label: 'Промежуток' },
  { value: SELECT, label: 'Выбор' },
  { value: DEPENDS_ON, label: 'Зависит от' },
];
