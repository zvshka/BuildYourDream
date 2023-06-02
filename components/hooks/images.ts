import axios, { AxiosResponse } from 'axios';
import { showNotification } from '@mantine/notifications';

export const uploadImageMutation = {
  mutationFn: (imageData: any) =>
    axios.post('/api/images', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  onSuccess: (response: AxiosResponse<{ url: string }>) => {
    showNotification({
      title: 'Успех',
      message: 'Вы успешно загрузили изображение',
      color: 'green',
    });
    return response;
  },
  onError: () => {
    showNotification({
      title: 'Ошибка',
      message: 'Что-то пошло не так',
      color: 'red',
    });
    return null;
  },
};
