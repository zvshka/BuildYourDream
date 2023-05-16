import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { ITemplate } from '../../../types/Template';
import {
  TemplateFormProvider,
  useTemplateForm,
} from '../../../components/Layout/forms/TemplateForm/TemplateContext';
import { useTemplateData } from '../../../components/hooks/templates';
import { TemplateForm } from '../../../components/Layout/forms/TemplateForm/TemplateForm';
import { storage } from '../../../lib/utils';

export default function EditForm() {
  const [loading, toggleLoading] = useToggle();

  const router = useRouter();

  const template = useTemplateForm({
    initialValues: {
      id: '',
      name: '',
      required: false,
      fields: [],
      showInConfigurator: false,
      position: -1,
    },
  });

  const { data: templateData, isSuccess } = useTemplateData(router.query.templateId as string);

  useEffect(() => {
    if (isSuccess) {
      template.setValues(templateData);
    }
  }, [isSuccess]);

  const updateTemplate = useMutation(
    (newTemplateData: ITemplate) =>
      axios.patch(
        `/api/templates/${router.query.templateId as string}`,
        {
          name: newTemplateData.name,
          fields: newTemplateData.fields,
          required: newTemplateData.required,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Форма успешно обновлена',
          color: 'green',
        });
        toggleLoading();
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения формы произошла ошибка',
          color: 'red',
        });
        toggleLoading();
      },
    }
  );
  const handleSubmit = async (values: typeof template.values) => {
    toggleLoading();
    updateTemplate.mutate(values);
  };

  return (
    <TemplateFormProvider form={template}>
      <TemplateForm handleSubmit={handleSubmit} loading={loading} />
    </TemplateFormProvider>
  );
}
