import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { ITemplate } from '../../../types/Template';
import { TemplateFormProvider } from '../../../components/Components/TemplateContext';
import { useTemplateData } from '../../../components/hooks/templates';
import { TemplateForm } from '../../../components/TemplateForm/TemplateForm';

export default function EditForm() {
  const [loading, toggleLoading] = useToggle();

  const router = useRouter();

  const template = useForm<ITemplate & { id?: string }>({
    initialValues: {
      id: '',
      name: '',
      required: false,
      fields: [],
      slots: [],
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
      axios.patch(`/api/templates/${router.query.templateId as string}`, {
        name: newTemplateData.name,
        fields: newTemplateData.fields,
        slots: newTemplateData.slots,
        required: newTemplateData.required,
        //TODO: Ограничения?
      }),
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

  //TODO: Make mutation
  const handleSubmit = async (values: typeof template.values) => {
    console.log(values);
    toggleLoading();
    updateTemplate.mutate(values);
  };

  return (
    <TemplateFormProvider form={template}>
      <TemplateForm handleSubmit={handleSubmit} loading={loading} />
    </TemplateFormProvider>
  );
}
