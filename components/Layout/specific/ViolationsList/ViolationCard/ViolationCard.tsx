import { Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { useModals } from '@mantine/modals';
import { Block } from '../../../general';
import { ViolationModal } from '../ViolationModal/ViolationModal';

export const ViolationCard = ({ reportData }) => {
  const { openModal } = useModals();

  const handleToggle = () => {
    openModal({
      size: 'lg',
      title: (
        <Text>
          Жалоба на{' '}
          {reportData.config ? 'сборку' : reportData.comment ? 'комментарий' : 'пользователя'}
        </Text>
      ),
      children: <ViolationModal reportData={reportData} />,
    });
  };

  return (
    <Block sx={{ cursor: 'pointer' }} onClick={handleToggle}>
      <Stack spacing={4}>
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
        <Text>
          <Text span weight={600}>
            Виновник:
          </Text>{' '}
          {reportData.user.username}
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
        <Text>
          <Text span weight={600}>
            Истекает:
          </Text>{' '}
          {dayjs(reportData.expiredAt).format('DD.MM.YYYY hh:mm')}
        </Text>
        <Text>
          <Text span weight={600}>
            Варнов:
          </Text>{' '}
          {reportData.warns}
        </Text>
      </Stack>
    </Block>
  );
};
