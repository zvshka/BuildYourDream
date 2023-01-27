import { Box, Paper, Stack } from '@mantine/core';
import React from 'react';
import { Block, PageHeader } from '../components/Layout';
import { PopupEdit } from '../components/Layout/PopupEdit/PopupEdit';

export default function HomePage() {
  return (
    <Stack>
      <PageHeader title="Главная страница" />
      <Block>
        <PopupEdit />
      </Block>
    </Stack>
  );
}
