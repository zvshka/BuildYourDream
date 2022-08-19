import { Stack } from '@mantine/core';
import { ConfigsItem } from '../../components/ConfigsItem/ConfigsItem';

export default function Configs() {
  return (
    <>
      <Stack>
        <ConfigsItem />
        <ConfigsItem />
        <ConfigsItem />
      </Stack>
    </>
  );
}
