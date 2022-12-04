import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FormsFormProvider, useFormsForm } from '../../../components/Parts/FormContext';
import { IField, IFormValues } from '../../../types/Form';
import { Container } from '@mantine/core';
import { Form } from '../../../components/Parts/Form';
import { Block } from '../../../components/Block/Block';

interface IPart {
  id: string;
  formId: string;
  data: IFormValues;
}

export default function editPartPage() {
  const router = useRouter();
  const [partData, setPartData] = useState<IPart>();
  const [formData, setFormData] = useState<any>();
  const [formIsReady, setFormIsReady] = useState<boolean>(false);
  const form = useFormsForm({
    initialValues: {
      tier: 0,
      pros: [],
      cons: [],
      image: {
        base64: '',
        file: null,
      },
    },
  });
  useEffect(() => {
    axios.get(`/api/parts/details/${router.query.partId}`).then((res) => setPartData(res.data));
  }, []);

  useEffect(() => {
    if (partData?.formId) {
      axios.get(`/api/forms/${partData.formId}`).then((res) => setFormData(res.data));
    }
  }, [partData]);

  useEffect(() => {
    if (formData) {
      formData.fields.forEach((field: IField) => {
        switch (field.type) {
          case 'TEXT':
          case 'LARGE_TEXT':
            form.setFieldValue(field.name, partData?.data[field.name] || '');
            break;
          case 'NUMBER':
            form.setFieldValue(field.name, partData?.data[field.name] || 0);
            break;
          case 'BOOL':
            form.setFieldValue(field.name, partData?.data[field.name] || false);
            break;
          case 'RANGE':
            form.setFieldValue(field.name, partData?.data[field.name] || [0, 0]);
            break;
          case 'SELECT':
            form.setFieldValue(field.name, partData?.data[field.name] || '');
            break;
        }
      });

      form.setFieldValue('pros', partData?.data.pros || []);
      form.setFieldValue('cons', partData?.data.cons || []);
      form.setFieldValue('image.base64', partData?.data.image.url);

      setFormIsReady(true);
    }
  }, [formData]);

  return (
    <FormsFormProvider form={form}>
      <Container size="sm">
        <Block>{formData && formIsReady && <Form formFields={formData?.fields} />}</Block>
      </Container>
    </FormsFormProvider>
  );
}
