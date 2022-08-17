import { Button } from '@mantine/core';
import { NextLink } from '@mantine/next';
import Shell from '../../components/Shell/Shell';

export default function Parts() {
  return (
    <Shell>
      <Button href="/parts/new" component={NextLink}>
        Добавить
      </Button>
    </Shell>
  );
}
