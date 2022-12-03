import { createFormContext } from '@mantine/form';
import { IFormValues } from '../../types/Form';

export const [FormsFormProvider, useFormsFormContext, useFormsForm] =
  createFormContext<IFormValues>();
