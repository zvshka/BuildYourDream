import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { CreateField } from '../../types/Field';
import { ITemplate } from '../../types/Template';
import { TemplateFormProvider } from '../../components/Components/TemplateContext';
import { LARGE_TEXT, RANGE, TEXT } from '../../types/FieldTypes';
import { TemplateForm } from '../../components/TemplateForm/TemplateForm';

export default function createTemplatePage() {
  const [loading, toggleLoading] = useToggle();
  const template = useForm<ITemplate>({
    initialValues: {
      id: '',
      position: -1,
      showInConfigurator: true,
      name: '',
      required: false,
      fields: [
        CreateField({
          name: 'Название',
          type: TEXT,
          deletable: false,
          editable: false,
          required: true,
        }),
        CreateField({
          name: 'Цена',
          type: RANGE,
          deletable: false,
          editable: false,
          required: true,
        }),
        CreateField({
          name: 'Описание детали',
          type: LARGE_TEXT,
          deletable: false,
          editable: false,
          required: true,
        }),
      ],
      slots: [],
    },
  });

  const createTemplate = useMutation(
    (templateData: ITemplate) =>
      axios.post('/api/templates', {
        name: templateData.name,
        fields: templateData.fields,
        slots: templateData.slots,
        required: templateData.required,
        //TODO: Ограничения?
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Форма успешно создана',
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
    createTemplate.mutate(values);
  };

  return (
    <TemplateFormProvider form={template}>
      <TemplateForm handleSubmit={handleSubmit} loading={loading} />
    </TemplateFormProvider>
  );
}
