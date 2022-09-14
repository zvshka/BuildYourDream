import { Card, createStyles, Group, Image, ScrollArea, Stack, Text } from '@mantine/core';
import { IconCurrencyRubel, IconMessage, IconMessage2, IconStar } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  cardBody: {
    height: 250,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  description: {
    maxHeight: 90,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
  },
}));

export const ConfigCard = ({ configData }: { configData: any }) => {
  const { classes } = useStyles();
  return (
    <Card shadow="sm" p="lg" withBorder>
      <Card.Section>
        <Image src={configData?.image} height={160} alt="Config Image" withPlaceholder />
      </Card.Section>

      <Card.Section px="lg" pb="lg" className={classes.cardBody}>
        <Stack spacing={0}>
          <Stack mt="md" mb="xs" spacing="xs">
            <Text weight={500}>{configData?.title || 'CONFIG TITLE'}</Text>
            <Group spacing={0}>
              <IconCurrencyRubel size={20} />
              <Text weight={400}>{configData?.totalPrice || 50000}</Text>
            </Group>
          </Stack>

          <ScrollArea style={{ height: 90 }} offsetScrollbars>
            <Text size="sm" color="dimmed">
              Эта великолепная сборка затащит любую игру которая может выйти в ближайшие 200 лет
              потому что ртх 4090 ебет райзен по шине памяти жетского диска так что вам нужна только
              эта сборка собирайте срочно
            </Text>
          </ScrollArea>
        </Stack>

        {/*<Button variant="light" color="blue" fullWidth mt="md" radius="md">*/}
        {/*  Book classic tour now*/}
        {/*</Button>*/}
        <Group position="apart">
          <Group spacing="xs">
            <IconMessage2 />
            <Text>69</Text>
          </Group>
          <Group spacing="xs">
            <IconStar />
            <Text>4.9</Text>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
};
