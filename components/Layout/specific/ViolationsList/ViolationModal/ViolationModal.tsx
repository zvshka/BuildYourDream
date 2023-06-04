import dayjs from 'dayjs';
import { Anchor, Divider, NumberInput, SegmentedControl, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { DatesProvider, DateTimePicker } from '@mantine/dates';

export const ViolationModal = ({ reportData }) => {
  return (
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
        readOnly={reportData.approved || reportData.rejected}
        value="approve"
        data={[
          { label: 'Отклонить', value: 'reject' },
          { label: 'Одобрить', value: 'approve' },
        ]}
      />
      <Stack spacing={8}>
        <NumberInput
          label="Штрафов"
          readOnly={reportData.approved || reportData.rejected}
          value={reportData.warns}
        />
        <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
          <DateTimePicker
            label="Истекает"
            readOnly={reportData.approved || reportData.rejected}
            valueFormat="DD MMM YYYY hh:mm"
            minDate={dayjs().add(5, 'minute').toDate()}
            value={dayjs(reportData.expiredAt).toDate()}
          />
        </DatesProvider>
      </Stack>
    </Stack>
  );
};
