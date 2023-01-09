import cuid from 'cuid';

export interface IField {
  id?: string;
  name: string;
  type: string;
  description?: string;
  haveDescription?: boolean;
  required?: boolean;
  editable?: boolean;
  deletable?: boolean;
  options?: string[];
}

export const CreateField = (props: IField) => {
  const { options, editable, deletable, name, type, id, ...other } = props;
  const toReturn: IField = { name, type, id, ...other };
  if (type === 'SELECT') toReturn.options = options;
  if (!toReturn.id) toReturn.id = cuid();
  toReturn.editable = editable ?? true;
  toReturn.deletable = deletable ?? true;
  return toReturn;
};
