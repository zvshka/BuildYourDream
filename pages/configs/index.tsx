import Shell from '../../components/Shell/Shell';
import { Stack } from '@mantine/core';
import { ConfigsItem } from '../../components/ConfigsItem/ConfigsItem';

export default function Configs() {
  return (
    <Shell>
      <Stack>
        <ConfigsItem />
        <ConfigsItem />
        <ConfigsItem />
      </Stack>
    </Shell>
  );
}
