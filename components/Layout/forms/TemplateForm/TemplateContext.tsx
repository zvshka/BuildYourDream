import { createFormContext } from '@mantine/form';
import { IComponent, ITemplate } from '../../../../types/Template';

export const [ComponentFormProvider, useComponentFormContext, useComponentForm] =
  createFormContext<IComponent>();

export const [TemplateFormProvider, useTemplateFormContext, useTemplateForm] =
  createFormContext<ITemplate>();
