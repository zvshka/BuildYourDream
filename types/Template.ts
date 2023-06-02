import { IField } from './Field';

export interface IMaxCount {
  type: 'number' | 'depends_on';
  count: number;
  templateId?: string;
  fieldId?: string;
  multiplierId?: string;
}

export interface ITemplate {
  id: string;
  name: string;
  required: boolean;
  position: number;
  showInConfigurator: boolean;

  maxCount: IMaxCount;

  fields: IField[];
}

export interface IComponentBody {
  imageUrl?: string;
  tier: 'low' | 'medium' | 'high';
  pros: string[];
  cons: string[];

  [key: string]: any;
}

export interface IComponent {
  id: string;
  templateId: string;
  data: IComponentBody;
  approved?: Boolean;
}
