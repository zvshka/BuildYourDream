import { createFormContext } from '@mantine/form';
import { IComponent, ITemplate } from '../../types/Template';

export const [TemplateFormProvider, useTemplateFormContext, useTemplateForm] =
  createFormContext<IComponent>();
