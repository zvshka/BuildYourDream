import { Button } from '@mantine/core';
import { NextLink } from '@mantine/next';

export default function Parts() {
  return (
    <>
      <Button href="/parts/new" component={NextLink}>
        Добавить
      </Button>
    </>
  );
}
