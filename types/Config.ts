import { User } from './User';
import { IComponent } from './Template';

export interface IConfig {
  id: string;
  title: string;
  description: string;
  author: User;
  authorId: string;
  price: [number, number];
  configTier: string;
  components: {
    id: string;
    templateId: string;
    componentId: string;
    count: number;
    component: IComponent & { avgRating: number };
  }[];
}

export interface IConfigsList {
  totalCount: number;
  currentPage: number;
  result: IConfig[];
}
