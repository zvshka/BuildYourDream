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
import { IComponentBody } from '../../../../types/Template';
import { useTemplateData } from '../../../hooks/templates';

export const ComponentRow = ({
  component,
  templateId,
  totalComments,
  onRemove,
}: {
  component: IComponentBody;
  templateId: string;
  totalComments?: number;
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
              ? { src: `${component.imageUrl}?quality=60` }
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
              ? { src: `${component.imageUrl}?quality=60` }
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
                    <Text fz={18}>0.0</Text>
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
      {/*<MediaQuery styles={{ minHeight: 300 }} smallerThan="sm">*/}
      {/*  <Grid h="100%">*/}
      {/*    <MediaQuery styles={{ borderRight: '2px solid lightgrey' }} largerThan="sm">*/}
      {/*      <MediaQuery styles={{ display: 'none' }} smallerThan="sm">*/}
      {/*        <Grid.Col xs={12} md="content">*/}
      {/*          <Image*/}
      {/*            withPlaceholder*/}
      {/*            radius="sm"*/}
      {/*            width={280}*/}
      {/*            height={280}*/}
      {/*            {...(component.imageUrl && component.imageUrl.length > 0*/}
      {/*              ? { src: `${component.imageUrl}?quality=60` }*/}
      {/*              : {})}*/}
      {/*          />*/}
      {/*        </Grid.Col>*/}
      {/*      </MediaQuery>*/}
      {/*    </MediaQuery>*/}
      {/*    <Grid.Col span="auto" sx={{ zIndex: 4 }}>*/}
      {/*      <MediaQuery styles={{ height: '85%' }} smallerThan="sm">*/}
      {/*        <Grid h="105%">*/}
      {/*          <Grid.Col span="auto" h="100%">*/}
      {/*            <Stack spacing={8} h="100%">*/}
      {/*              <Title order={3} sx={{ wordWrap: 'break-word' }}>*/}
      {/*                {isSuccess && templateData.name} {component['Название']}*/}
      {/*              </Title>*/}
      {/*              <Text>Tier: {component.tier.toUpperCase()}</Text>*/}
      {/*              {isSuccess &&*/}
      {/*                templateData.fields*/}
      {/*                  .filter((f, i) => f.showInDetails)*/}
      {/*                  .map((f) => (*/}
      {/*                    <Text key={f.id}>*/}
      {/*                      {f.name}:{' '}*/}
      {/*                      {component[f.name] instanceof Array*/}
      {/*                        ? component[f.name].join(' - ')*/}
      {/*                        : component[f.name]}*/}
      {/*                    </Text>*/}
      {/*                  ))}*/}
      {/*              <Group mt="auto" position="apart">*/}
      {/*                <Rating*/}
      {/*                  size="lg"*/}
      {/*                  readOnly*/}
      {/*                  sx={(theme) => ({*/}
      {/*                    outline: '1px solid lightgrey',*/}
      {/*                    borderRadius: theme.radius.sm,*/}
      {/*                  })}*/}
      {/*                  px="xs"*/}
      {/*                  py={4}*/}
      {/*                />*/}
      {/*                {totalComments && (*/}
      {/*                  <Box>*/}
      {/*                    <MediaQuery styles={{ display: 'none' }} largerThan="sm">*/}
      {/*                      <Group*/}
      {/*                        sx={(theme) => ({*/}
      {/*                          outline: '1px solid lightgrey',*/}
      {/*                          borderRadius: theme.radius.sm,*/}
      {/*                        })}*/}
      {/*                        spacing={8}*/}
      {/*                        pl="sm"*/}
      {/*                      >*/}
      {/*                        <Text fz={16}>{totalComments > 999 ? '999+' : totalComments}</Text>*/}
      {/*                        <ActionIcon size="lg" variant="outline">*/}
      {/*                          <IconMessage />*/}
      {/*                        </ActionIcon>*/}
      {/*                      </Group>*/}
      {/*                    </MediaQuery>*/}
      {/*                    <MediaQuery styles={{ display: 'none' }} smallerThan="sm">*/}
      {/*                      <Group*/}
      {/*                        spacing={8}*/}
      {/*                        sx={(theme) => ({*/}
      {/*                          outline: '1px solid lightgrey',*/}
      {/*                          borderRadius: theme.radius.sm,*/}
      {/*                        })}*/}
      {/*                        pr="xs"*/}
      {/*                      >*/}
      {/*                        <ActionIcon size="lg" variant="outline">*/}
      {/*                          <IconMessage />*/}
      {/*                        </ActionIcon>*/}
      {/*                        <Text fz={16}>{totalComments > 999 ? '999+' : totalComments}</Text>*/}
      {/*                      </Group>*/}
      {/*                    </MediaQuery>*/}
      {/*                  </Box>*/}
      {/*                )}*/}
      {/*              </Group>*/}
      {/*            </Stack>*/}
      {/*          </Grid.Col>*/}
      {/*          <Grid.Col xs={12} md="content">*/}
      {/*            <MediaQuery styles={{ display: 'none' }} smallerThan="sm">*/}
      {/*              <Stack align="end" h="100%">*/}
      {/*                <ActionIcon variant="outline" color="yellow" size="lg">*/}
      {/*                  <IconBookmark />*/}
      {/*                </ActionIcon>*/}
      {/*                <Stack mt="auto" w={224}>*/}
      {/*                  <Text fz={24} align={addToConfig ? 'center' : 'right'}>*/}
      {/*                    {component['Цена'][0]} - {component['Цена'][1]}*/}
      {/*                  </Text>*/}
      {/*                  {addToConfig && <Button>Добавить в сборку</Button>}*/}
      {/*                </Stack>*/}
      {/*              </Stack>*/}
      {/*            </MediaQuery>*/}
      {/*            <MediaQuery styles={{ display: 'none' }} largerThan="sm">*/}
      {/*              <Box>*/}
      {/*                {addToConfig && (*/}
      {/*                  <Stack align="center">*/}
      {/*                    <Text fz={24}>*/}
      {/*                      {component['Цена'][0]} - {component['Цена'][1]}*/}
      {/*                    </Text>*/}
      {/*                    <Group>*/}
      {/*                      <Button w={224}>Добавить в сборку</Button>*/}
      {/*                      <ActionIcon variant="outline" color="yellow" size="lg">*/}
      {/*                        <IconBookmark />*/}
      {/*                      </ActionIcon>*/}
      {/*                    </Group>*/}
      {/*                  </Stack>*/}
      {/*                )}*/}
      {/*                {!addToConfig && (*/}
      {/*                  <Group position="apart">*/}
      {/*                    <Text fz={24}>*/}
      {/*                      {component['Цена'][0]} - {component['Цена'][1]}*/}
      {/*                    </Text>*/}
      {/*                    <ActionIcon variant="outline" color="yellow" size="lg">*/}
      {/*                      <IconBookmark />*/}
      {/*                    </ActionIcon>*/}
      {/*                  </Group>*/}
      {/*                )}*/}
      {/*              </Box>*/}
      {/*            </MediaQuery>*/}
      {/*          </Grid.Col>*/}
      {/*        </Grid>*/}
      {/*      </MediaQuery>*/}
      {/*    </Grid.Col>*/}
      {/*  </Grid>*/}
      {/*</MediaQuery>*/}
    </Box>
  );
};
