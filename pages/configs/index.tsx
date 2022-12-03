import { Group, Stack, Title } from '@mantine/core';
import React from 'react';
import { Block } from '../../components/Block/Block';

export default function Configs() {
  return (
    <Stack>
      <Block>
        <Group position="apart">
          <Title order={3}>Пользовательские сборки</Title>
        </Group>
      </Block>
    </Stack>
  );
}
