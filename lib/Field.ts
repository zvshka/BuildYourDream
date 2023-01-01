export interface IField {
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
  const { options, editable, deletable, name, type, ...other } = props;
  const toReturn: IField = { name, type, ...other };
  if (type === 'SELECT') {
    toReturn.options = options;
  }
  toReturn.editable = editable ?? true;
  toReturn.deletable = deletable ?? true;
  return toReturn;
};
