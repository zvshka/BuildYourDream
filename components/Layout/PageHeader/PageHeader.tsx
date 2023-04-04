import { Group, Stack, Title } from '@mantine/core';
import { Block } from '../Block/Block';

export const PageHeader = ({ rightSection, title }: { rightSection?: any; title: string }) => (
  <Block>
    <Group position="apart">
      <Title order={3}>{title}</Title>
      {rightSection}
    </Group>
  </Block>
);
