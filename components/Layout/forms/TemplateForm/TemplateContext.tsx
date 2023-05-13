import { createFormContext } from '@mantine/form';
import { IComponentBody, ITemplate } from '../../../../types/Template';

export const [ComponentFormProvider, useComponentFormContext, useComponentForm] =
  createFormContext<IComponentBody>();

export const [TemplateFormProvider, useTemplateFormContext, useTemplateForm] =
  createFormContext<ITemplate>();
