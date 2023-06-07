import { Button, Center, Rating, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../../../../lib/utils';
import { showNotification } from '@mantine/notifications';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';

export const ReviewModal = ({
  componentId,
  reviewData,
}: {
  componentId?: string;
  reviewData?: any;
}) => {
  const form = useForm({
    initialValues: {
      text: reviewData?.text || '',
      rating: reviewData?.rating || 0,
    },
    validate: {
      rating: (value) => (value > 0 && value <= 5 ? null : 'Должно быть больше 0 и меньше 5'),
      text: (value) => (value.length > 1200 ? 'Не больше 1200 символов' : null),
    },
  });

  const createReviewMutation = useMutation(
    (data: any) =>
      axios.post(
        `/api/components/${componentId}/reviews`,
        {
          text: data.text,
          rating: data.rating,
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
          message: 'Вы успешно создали отзыв',
          color: 'green',
        });
        queryClient.invalidateQueries(['reviews']);
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const updateReviewMutation = useMutation(
    (data: any) =>
      axios.patch(
        `/api/reviews/${reviewData.id}`,
        {
          text: data.text,
          rating: data.rating,
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
          message: 'Вы успешно изменили отзыв',
          color: 'green',
        });
        queryClient.invalidateQueries(['reviews']);
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    if (!reviewData) createReviewMutation.mutate(values);
    else updateReviewMutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Textarea minRows={7} maxLength={1200} {...form.getInputProps('text')} />
        <Center>
          <Rating size="xl" {...form.getInputProps('rating')} />
        </Center>
        <Button type="submit">Отправить</Button>
      </Stack>
    </form>
  );
};
