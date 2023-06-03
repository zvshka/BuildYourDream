import { Container, Stack } from '@mantine/core';
import React from 'react';
import { PageHeader } from '../../components/Layout';
import { ConfigsList } from '../../components/Layout/specific/ConfigsList/ConfigsList';

export default function Configs() {
  return (
    <Container size="xl" sx={{ height: '100%' }} px={0}>
      <Stack>
        <PageHeader title="Пользовательские сборки" />
        <ConfigsList />
      </Stack>
    </Container>
  );
}
