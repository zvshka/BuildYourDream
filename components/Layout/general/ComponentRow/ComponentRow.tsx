import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Image,
  MediaQuery,
  Overlay,
  Rating,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import { IconBookmark, IconMessage } from '@tabler/icons-react';
import { IComponentBody } from '../../../../types/Template';
import { useTemplateData } from '../../../hooks/templates';

export const ComponentRow = ({
  component,
  templateId,
  addToConfig,
}: {
  component: IComponentBody;
  templateId: string;
  addToConfig?: boolean;
}) => {
  const { data: templateData, isSuccess } = useTemplateData(templateId);

  return (
    <Box w="100%">
      <Grid sx={{ position: 'relative' }}>
        <MediaQuery styles={{ borderRight: '2px solid lightgrey' }} largerThan="sm">
          <Grid.Col xs={12} md="content">
            <MediaQuery
              styles={{ position: 'absolute', zIndex: 0, right: 0, left: 0, margin: 'auto' }}
              smallerThan="sm"
            >
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
            <MediaQuery styles={{ display: 'none' }} largerThan="sm">
              <Overlay color="rgb(255, 255, 255)" opacity={0.9} zIndex={1} />
            </MediaQuery>
          </Grid.Col>
        </MediaQuery>
        <Grid.Col span="auto" sx={{ zIndex: 4 }}>
          <Grid h="105%">
            <Grid.Col span="auto">
              <Stack spacing={8} h="100%">
                <Title order={3} sx={{ wordWrap: 'break-word', maxWidth: 320 }}>
                  {isSuccess && templateData.name} {component['Название']}
                </Title>
                <Text>Tier: {component.tier.toUpperCase()}</Text>
                {isSuccess &&
                  templateData.fields
                    .filter((f, i) => f.showInDetails)
                    .map((f) => (
                      <Text>
                        {f.name}:{' '}
                        {component[f.name] instanceof Array
                          ? component[f.name].join(' - ')
                          : component[f.name]}
                      </Text>
                    ))}
                <Group mt="auto" position="apart">
                  <Rating size="lg" readOnly />
                  <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                    <Group>
                      <Text fz={20}>999+</Text>
                      <ActionIcon size="lg" variant="outline">
                        <IconMessage />
                      </ActionIcon>
                    </Group>
                  </MediaQuery>
                  <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                    <Group>
                      <ActionIcon size="lg" variant="outline">
                        <IconMessage />
                      </ActionIcon>
                      <Text fz={20}>999+</Text>
                    </Group>
                  </MediaQuery>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col xs={12} md="content">
              <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                <Stack align="end" h="100%">
                  <ActionIcon variant="outline" color="yellow" size="lg">
                    <IconBookmark />
                  </ActionIcon>
                  <Stack mt="auto" w={224}>
                    <Text fz={26} align={addToConfig ? 'center' : 'right'}>
                      {component['Цена'][0]} - {component['Цена'][1]}
                    </Text>
                    {addToConfig && <Button>Добавить в сборку</Button>}
                  </Stack>
                </Stack>
              </MediaQuery>
              <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                <Box>
                  {addToConfig && (
                    <Stack align="center">
                      <Text fz={24}>
                        {component['Цена'][0]} - {component['Цена'][1]}
                      </Text>
                      <Group>
                        <Button w={224}>Добавить в сборку</Button>
                        <ActionIcon variant="outline" color="yellow" size="lg">
                          <IconBookmark />
                        </ActionIcon>
                      </Group>
                    </Stack>
                  )}
                  {!addToConfig && (
                    <Group position="apart">
                      <Text fz={24}>
                        {component['Цена'][0]} - {component['Цена'][1]}
                      </Text>
                      <ActionIcon variant="outline" color="yellow" size="lg">
                        <IconBookmark />
                      </ActionIcon>
                    </Group>
                  )}
                </Box>
              </MediaQuery>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
