import { Button, Center, Grid, Pagination, Select, Stack, Text } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { Block } from '../../general';
import { useAuth } from '../../../Providers/AuthContext/AuthWrapper';
import { ReviewModal } from './ReviewModal/ReviewModal';
import { useComponentReviews, useUserReviews } from '../../../hooks/reviews';

export const ReviewsList = ({
  componentId,
  username,
}: {
  componentId?: string;
  username?: string;
}) => {
  const { user } = useAuth();
  const [activePage, setPage] = useState(1);

  const handleReview = () => {
    openModal({
      title: 'Форма отзыва',
      children: <ReviewModal componentId={componentId as string} />,
    });
  };

  const sortForm = useForm({
    initialValues: {
      orderBy: 'createdAt',
      orderDir: 'desc',
    },
  });

  const {
    data: reviews,
    isSuccess,
    refetch,
  } = componentId && !username
    ? useComponentReviews(componentId, {
        page: activePage,
        ...sortForm.values,
      })
    : useUserReviews(username as string, {
        page: activePage,
        ...sortForm.values,
      });

  useEffect(() => {
    refetch();
  }, [activePage, sortForm.values]);

  return (
    <Stack>
      <Block>
        <Grid>
          <Grid.Col span="auto">
            <Select
              data={[
                { label: 'Дата создания', value: 'createdAt' },
                { label: 'Оценка', value: 'rating' },
              ]}
              {...sortForm.getInputProps('orderBy')}
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <Select
              data={[
                { label: 'По убыванию', value: 'desc' },
                { label: 'По возрастанию', value: 'asc' },
              ]}
              {...sortForm.getInputProps('orderDir')}
            />
          </Grid.Col>
          {user && componentId && (
            <Grid.Col span="auto">
              <Center>
                <Button fullWidth onClick={handleReview}>
                  Оставить отзыв
                </Button>
              </Center>
            </Grid.Col>
          )}
        </Grid>
      </Block>
      <Block>
        <Pagination total={10} />
      </Block>

      <Block>
        <Center h={200}>
          <Text>Еще нет отзывов</Text>
        </Center>
      </Block>

      <Block>
        <Pagination total={10} />
      </Block>
    </Stack>
  );
};
