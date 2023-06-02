import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Modal,
  NumberInput,
  Pagination,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { DatePickerInput, DatesProvider, DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import Link from 'next/link';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
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
            Виновник:{' '}
          </Text>
          {reportData.user.username}
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
            <Text>{reportData.commentBody}</Text>
          </Stack>
        )}
        {reportData.config && (
          <Stack spacing={0}>
            <Text weight={600}>Название сборки:</Text>
            <Text>{reportData.configTitle}</Text>
            <Text weight={600}>Описание сборки:</Text>
            <Text>{reportData.configDescription}</Text>
            <Link href={`/configs/${reportData.config.id}`}>
              <Anchor>Ссылка на сборку</Anchor>
            </Link>
          </Stack>
        )}
        {reportData.user && !reportData.config && !reportData.comment && (
          <Stack spacing={0}>
            <Text weight={600}>Биография пользователя:</Text>
            <Text>{reportData.userBio || 'Нет биографии'}</Text>
            <Text weight={600}>Ссылка на аватар пользователя:</Text>
            {reportData.userAvatarUrl ? (
              <Link href={reportData.userAvatarUrl || ''}>
                <Anchor>Ссылка на аватар</Anchor>
              </Link>
            ) : (
              <Text>Нет аватара</Text>
            )}
            <Link href={`/profile/${reportData.user.username}`}>
              <Anchor>Ссылка на пользователя</Anchor>
            </Link>
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
            {!(reportData.approved || reportData.rejected) && (
              <Switch
                label="Удалить сборку/комментарий?"
                {...approveForm.getInputProps('deleteSubject', { type: 'checkbox' })}
                disabled={!reportData.config && !reportData.comment}
              />
            )}
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
  const router = useRouter();
  const [showModal, { toggle }] = useDisclosure(false);

  const handleToggle = () => {
    toggle();
    if (showModal) router.back();
    else router.push(`/admin/reports?showReport=${reportData.id}`);
  };

  useEffect(() => {
    if (router.query.showReport === reportData.id) {
      handleToggle();
    }
  }, []);

  return (
    <Box>
      <Modal
        opened={showModal}
        onClose={handleToggle}
        title={
          <Text>
            Жалоба на{' '}
            {reportData.config ? 'сборку' : reportData.comment ? 'комментарий' : 'пользователя'}
          </Text>
        }
      >
        <ReportModal reportData={reportData} />
      </Modal>
      <Block sx={{ cursor: 'pointer' }} onClick={handleToggle}>
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
    </Box>
  );
};

export default function ReportsPage() {
  const [activePage, setPage] = useState(1);

  const filterForm = useForm<{
    search: string;
    status: 'all' | 'approved' | 'rejected' | 'waiting';
    createdAt: [Date | null, Date | null];
    reviewAt: [Date | null, Date | null];
  }>({
    initialValues: {
      search: '',
      status: 'all',
      createdAt: [null, null],
      reviewAt: [null, null],
    },
  });

  const [debouncedSearch] = useDebouncedValue(filterForm.values.search, 300);

  const {
    data: reportsData,
    isSuccess,
    refetch,
  } = useReportsList({
    page: activePage,
    search: debouncedSearch,
    createdAt: filterForm.values.createdAt,
    reviewAt: filterForm.values.reviewAt,
    status: filterForm.values.status,
  });

  useEffect(() => {
    refetch();
  }, [
    activePage,
    debouncedSearch,
    filterForm.values.status,
    filterForm.values.createdAt,
    filterForm.values.reviewAt,
  ]);

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader title="Жалобы пользователей" addBack />
        <Block>
          <SimpleGrid
            cols={1}
            breakpoints={[
              {
                cols: 2,
                minWidth: 'sm',
              },
              {
                cols: 3,
                minWidth: 'md',
              },
              {
                cols: 4,
                minWidth: 'lg',
              },
            ]}
          >
            <TextInput label="Поиск" {...filterForm.getInputProps('search')} />
            <Select
              data={[
                { value: 'all', label: 'Все' },
                { value: 'approved', label: 'Рассмотрено' },
                { value: 'rejected', label: 'Отклонено' },
                { value: 'waiting', label: 'Ожидает рассмотрения' },
              ]}
              label="Статус"
              {...filterForm.getInputProps('status')}
            />
            <DatePickerInput
              type="range"
              label="Дата создания жалобы"
              locale="ru"
              {...filterForm.getInputProps('createdAt')}
            />
            <DatePickerInput
              type="range"
              label="Дата рассмотрения жалобы"
              locale="ru"
              {...filterForm.getInputProps('reviewAt')}
            />
          </SimpleGrid>
        </Block>
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
            <Center h={170}>
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
