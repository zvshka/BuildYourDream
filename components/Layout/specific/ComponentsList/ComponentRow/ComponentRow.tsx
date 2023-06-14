import {
  ActionIcon,
  Box,
  Grid,
  Group,
  Image,
  MediaQuery,
  Overlay,
  Rating,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import React from 'react';
import {
  IconBookmark,
  IconCurrencyRubel,
  IconMessage,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';
import { IComponentBody } from '../../../../../types/Template';
import { useTemplateData } from '../../../../hooks/templates';

const myToFixed = (n, digits) => {
  const currentDigits = digits || 0;
  return n.toFixed(digits).replace(new RegExp(`\\.0{${currentDigits}}`), '');
};

export const ComponentRow = ({
  component,
  templateId,
  totalComments,
  onRemove,
  avgRating,
}: {
  component: IComponentBody;
  templateId: string;
  totalComments?: number;
  avgRating: number;
  onRemove?: any;
}) => {
  const { data: templateData, isSuccess } = useTemplateData(templateId);
  const theme = useMantineTheme();

  return (
    <Box w="100%" sx={{ position: 'relative' }}>
      <MediaQuery styles={{ display: 'none' }} largerThan="sm">
        <Box>
          <Image
            sx={{ position: 'absolute', zIndex: 0, right: 0, left: 0, margin: 'auto' }}
            withPlaceholder
            radius="sm"
            width={280}
            height={280}
            {...(component.imageUrl && component.imageUrl.length > 0
              ? { src: `${component.imageUrl}?quality=60&width=320` }
              : {})}
          />
          <Overlay color="rgb(255, 255, 255)" opacity={0.9} zIndex={1} />
        </Box>
      </MediaQuery>
      <Group align="normal" noWrap>
        <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
          <Image
            withPlaceholder
            radius="sm"
            width={280}
            height={280}
            {...(component.imageUrl && component.imageUrl.length > 0
              ? { src: `${component.imageUrl}?quality=60&width=320` }
              : {})}
          />
        </MediaQuery>
        <Stack
          sx={{
            zIndex: 2,
            [theme.fn.smallerThan('sm')]: {
              minHeight: 300,
            },
            width: '100%',
            position: 'relative',
          }}
        >
          <Grid h="100%" m={0}>
            <Grid.Col span="auto">
              <Stack spacing={0}>
                <Title order={3} sx={{ wordWrap: 'break-word' }}>
                  {isSuccess && templateData.name} {component['Название']}
                </Title>
                <Text>
                  <Text span weight={600}>
                    Tier:{' '}
                  </Text>
                  {component.tier.toUpperCase()}
                </Text>
                {isSuccess &&
                  templateData.fields
                    .filter((f) => f.showInDetails)
                    .map((f) => (
                      <Text key={f.id}>
                        <Text span weight={600}>
                          {f.name}:{' '}
                        </Text>
                        {component[f.name] instanceof Array
                          ? component[f.name].join(' - ')
                          : component[f.name]}
                      </Text>
                    ))}
              </Stack>
            </Grid.Col>
            <Grid.Col span="content">
              <Group>
                <ActionIcon variant="outline" color="yellow" size="lg">
                  <IconBookmark />
                </ActionIcon>
                {onRemove && (
                  <ActionIcon variant="outline" color="red" size="lg" onClick={onRemove}>
                    <IconTrash />
                  </ActionIcon>
                )}
              </Group>
            </Grid.Col>
            <Grid.Col span={12} mt="auto">
              <Group position="apart" align="end">
                <Group
                  sx={{
                    [theme.fn.smallerThan('sm')]: {
                      display: 'none',
                    },
                  }}
                >
                  <Rating
                    size="md"
                    readOnly
                    sx={{
                      outline: '1px solid lightgrey',
                      borderRadius: theme.radius.sm,
                    }}
                    px="xs"
                    py={4}
                    value={avgRating}
                  />
                  <Group
                    spacing="xs"
                    sx={{
                      outline: '1px solid lightgrey',
                      borderRadius: theme.radius.sm,
                    }}
                    px="xs"
                    py={1}
                  >
                    <IconMessage size={20} />
                    <Text fz={18}>
                      {totalComments && totalComments > 999 ? '999+' : totalComments || 0}
                    </Text>
                  </Group>
                </Group>
                <Stack
                  spacing={8}
                  sx={{
                    [theme.fn.largerThan('sm')]: {
                      display: 'none',
                    },
                  }}
                >
                  <Group spacing="xs">
                    <IconMessage />
                    <Text fz={18}>
                      {totalComments && totalComments > 999 ? '999+' : totalComments || 0}
                    </Text>
                  </Group>
                  <Group spacing="xs">
                    <IconStarFilled style={{ color: 'orange' }} />
                    <Text fz={18}>{avgRating ? myToFixed(avgRating, 1) : '0.0'}</Text>
                  </Group>
                </Stack>
                <Group spacing={4} sx={{ verticalAlign: 'bottom' }}>
                  <Text
                    fz={20}
                    sx={{
                      [theme.fn.smallerThan('sm')]: {
                        fontSize: theme.fontSizes.xl,
                      },
                    }}
                  >
                    {component['Цена'][0]} - {component['Цена'][1]}
                  </Text>
                  <IconCurrencyRubel size={20} />
                </Group>
              </Group>
            </Grid.Col>
          </Grid>
        </Stack>
      </Group>
    </Box>
  );
};
