import { createFormContext } from '@mantine/form';
import { ICreateForm, ICreatePart } from '../../types/Form';

export const [FormsFormProvider, useFormsFormContext, useFormsForm] =
  createFormContext<ICreatePart | ICreateForm>();
