import { Card, createStyles, Group, Image, ScrollArea, Stack, Text } from '@mantine/core';
import { IconCurrencyRubel, IconMessage, IconMessage2, IconStar } from '@tabler/icons';
import { NextLink } from '@mantine/next';

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
    <Card
      shadow="sm"
      p="lg"
      withBorder
      sx={{ cursor: 'pointer' }}
      component={NextLink}
      href={`/configs/${configData?.id}`}
    >
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
              {configData.description}
            </Text>
          </ScrollArea>
        </Stack>

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
