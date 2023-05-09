import cuid from 'cuid';
import { DEPENDS_ON, SELECT } from './FieldTypes';

interface IDependency {
  template: string;
  field: string;
}
export interface IField {
  id: string;
  name: string;
  type: string;
  description?: string;
  haveDescription?: boolean;
  required?: boolean;
  editable?: boolean;
  deletable?: boolean;
  options?: string[];
  depends_on?: IDependency;
}

interface ICreateField extends Omit<IField, 'id'> {
  id?: string;
}

export const CreateField = (props: ICreateField) => {
  const { options, depends_on, editable, deletable, name, type, id, ...other } = props;
  const toReturn: IField = { name, type, id: id as string, ...other };
  if (type === SELECT) toReturn.options = options || [];
  if (type === DEPENDS_ON) toReturn.depends_on = depends_on || { template: '', field: '' };
  if (!toReturn.id) toReturn.id = cuid();
  toReturn.editable = editable ?? true;
  toReturn.deletable = deletable ?? true;
  return toReturn;
};
