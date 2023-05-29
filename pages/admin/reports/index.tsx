import {
  Button,
  Center,
  Container,
  Divider,
  NumberInput,
  Pagination,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { DatesProvider, DateTimePicker } from '@mantine/dates';
import { openModal } from '@mantine/modals';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { Block, PageHeader } from '../../../components/Layout';
import { useReportsList } from '../../../components/hooks/reports';
import { storage } from '../../../lib/utils';
import { queryClient } from '../../../components/Providers/QueryProvider/QueryProvider';

const ReportModal = ({ reportData }) => {
  const approveForm = useForm({
    initialValues: {
      warns: reportData.warns || 0,
      expiredAt: reportData.expiredAt
        ? dayjs(reportData.expiredAt).toDate()
        : dayjs().add(7, 'd').toDate(),
      deleteSubject: false,
      status: reportData.approved ? 'approve' : reportData.rejected ? 'reject' : 'reject',
    },
  });

  const approveMutation = useMutation(
    (values: Omit<typeof approveForm.values, 'status'>) =>
      axios.post(`/api/reports/${reportData.id}/approve`, values, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно одобрили жалобу',
          color: 'green',
        });
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
  const rejectMutation = useMutation(
    () =>
      axios.get(`/api/reports/${reportData.id}/reject`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно отклонили жалобу',
          color: 'green',
        });
        queryClient.invalidateQueries(['reports', 'list']);
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

  const handleSubmit = (values: typeof approveForm.values) => {
    const { status, ...data } = values;
    if (status === 'approve') approveMutation.mutate(data);
    if (status === 'reject') rejectMutation.mutate();
  };

  return (
    <form onSubmit={approveForm.onSubmit(handleSubmit)}>
      <Stack spacing={8}>
        <Text>
          <Text span weight={600}>
            Автор:{' '}
          </Text>
          {reportData.author.username}
        </Text>
        <Text>
          <Text span weight={600}>
            Причина:{' '}
          </Text>
          {reportData.reason}
        </Text>
        <Divider />
        {reportData.comment && (
          <Stack spacing={0}>
            <Text weight={600}>Содержание комментария:</Text>
            <Text>{reportData.comment.body}</Text>
          </Stack>
        )}
        {reportData.config && (
          <Stack spacing={0}>
            <Text weight={600}>Название сборки:</Text>
            <Text>{reportData.config.title}</Text>
            <Text weight={600}>Описание сборки:</Text>
            <Text>{reportData.config.description}</Text>
          </Stack>
        )}
        <Divider />
        <SegmentedControl
          {...approveForm.getInputProps('status')}
          readOnly={reportData.approved || reportData.rejected}
          data={[
            { label: 'Отклонить', value: 'reject' },
            { label: 'Одобрить', value: 'approve' },
          ]}
        />
        {approveForm.values.status === 'approve' && (
          <Stack spacing={8}>
            <NumberInput
              label="Штрафов"
              {...approveForm.getInputProps('warns')}
              readOnly={reportData.approved || reportData.rejected}
            />
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
              <DateTimePicker
                label="Истекает"
                {...approveForm.getInputProps('expiredAt')}
                readOnly={reportData.approved || reportData.rejected}
                valueFormat="DD MMM YYYY hh:mm"
                minDate={dayjs().add(5, 'minute').toDate()}
              />
            </DatesProvider>
            <Switch
              label="Удалить сборку/комментарий?"
              {...approveForm.getInputProps('deleteSubject', { type: 'checkbox' })}
              readOnly={reportData.approved || reportData.rejected}
            />
          </Stack>
        )}
        <Button type="submit" disabled={reportData.approved || reportData.rejected}>
          Сохранить
        </Button>
      </Stack>
    </form>
  );
};

const ReportCard = ({ reportData }) => {
  const handleShowReport = () => {
    openModal({
      title: (
        <Text>
          Жалоба на{' '}
          {reportData.config ? 'сборку' : reportData.comment ? 'комментарий' : 'пользователя'}
        </Text>
      ),
      children: <ReportModal reportData={reportData} />,
    });
  };

  return (
    <Block sx={{ cursor: 'pointer' }} onClick={handleShowReport}>
      <Stack spacing={8}>
        <Title order={4}>
          Жалоба на{' '}
          {reportData.config ? 'сборку' : reportData.comment ? 'комментарий' : 'пользователя'}
        </Title>
        <Text>
          <Text span weight={600}>
            Автор:
          </Text>{' '}
          {reportData.author.username}
        </Text>
        <Text color={reportData.rejected ? 'red' : reportData.approved ? 'green' : 'blue'}>
          <Text span color="black" weight={600}>
            Статус:{' '}
          </Text>
          {reportData.approved
            ? 'Рассмотрена'
            : reportData.rejected
            ? 'Отклонена'
            : 'В ожидании рассмотрения'}
        </Text>
      </Stack>
    </Block>
  );
};

export default function ReportsPage() {
  const [activePage, setPage] = useState(1);

  const {
    data: reportsData,
    isSuccess,
    refetch,
  } = useReportsList({
    page: activePage,
  });

  useEffect(() => {
    refetch();
  }, [activePage]);

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader title="Жалобы пользователей" addBack />
        <Block>
          <Pagination
            value={activePage}
            total={
              isSuccess && reportsData.totalCount > 0 ? Math.ceil(reportsData.totalCount / 10) : 1
            }
            onChange={setPage}
          />
        </Block>
        {isSuccess && reportsData.totalCount === 0 && (
          <Block h={200}>
            <Center>
              <Text>Здесь ничего нет...</Text>
            </Center>
          </Block>
        )}
        {isSuccess && reportsData.totalCount > 0 && (
          <SimpleGrid cols={4}>
            {reportsData.result.map((report) => (
              <ReportCard reportData={report} key={report.id} />
            ))}
          </SimpleGrid>
        )}
        <Block>
          <Pagination
            value={activePage}
            total={
              isSuccess && reportsData.totalCount > 0 ? Math.ceil(reportsData.totalCount / 10) : 1
            }
            onChange={setPage}
          />
        </Block>
      </Stack>
    </Container>
  );
}
