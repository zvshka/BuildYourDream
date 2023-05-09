import { IField } from './Field';

export interface IComponentImage {
  base64: string;
  file: File | null;
  url?: string;
}

export interface ITemplate {
  id: string;
  name: string;
  required: boolean;
  position: number;
  showInConfigurator: boolean;

  fields: IField[];
  slots: ISlot[];
}

export interface ISlot {
  id: string;
  componentId: string;
  innerField: string;
  outerField: string;
  compatibilityCondition: string;
}

export interface IComponent {
  image?: IComponentImage;
  tier: 'low' | 'medium' | 'high';
  pros: string[];
  cons: string[];

  [key: string]: any;
}
