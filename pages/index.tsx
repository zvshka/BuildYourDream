// import { Welcome } from '../components/Welcome/Welcome';
// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

import { Stack, Title } from '@mantine/core';
import React from 'react';
import { Block } from '../components/Block/Block';

export default function HomePage() {
  return (
    <Stack>
      <Block>
        <Title order={4}>Соберу свою мечту :3</Title>
      </Block>
    </Stack>
  );
}
