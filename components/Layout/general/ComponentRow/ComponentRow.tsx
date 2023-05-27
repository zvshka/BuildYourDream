import { Box, createStyles, Grid, Group, Image, MediaQuery, Stack, Title } from '@mantine/core';
import React from 'react';
import { IComponentBody } from '../../../../types/Template';
import { Block } from '../Block/Block';
import { useTemplateData } from '../../../hooks/templates';

const useStyles = createStyles((theme) => ({
  wrapper: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows.xl,
    },
  },
}));

export const ComponentRow = ({
  component,
  rightSide,
  templateId,
}: {
  component: IComponentBody;
  rightSide?: any;
  templateId: string;
}) => {
  const { classes } = useStyles();

  const { data: templateData, isSuccess } = useTemplateData(templateId);
  // console.log(templateData.fields.);

  return (
    <Box>
      <Block className={classes.wrapper}>
        <Grid>
          <Grid.Col span="auto">
            <Grid>
              <Grid.Col span="content">
                <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                  <Image
                    withPlaceholder
                    radius="sm"
                    width={200}
                    height={200}
                    {...(component.imageUrl && component.imageUrl.length > 0
                      ? { src: `${component.imageUrl}?quality=60` }
                      : {})}
                  />
                </MediaQuery>
                <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                  <Image
                    withPlaceholder
                    radius="sm"
                    width={100}
                    height={100}
                    {...(component.imageUrl && component.imageUrl.length > 0
                      ? { src: `${component.imageUrl}?quality=60` }
                      : {})}
                  />
                </MediaQuery>
              </Grid.Col>
              <Grid.Col span="auto">
                <Group position="apart" align="normal" h="100%">
                  <Stack>
                    <MediaQuery styles={{ fontSize: 18 }} smallerThan="sm">
                      <Title order={3}>{component['Название']}</Title>
                    </MediaQuery>
                  </Stack>
                  {/*<Stack h="100%" spacing={0} align="end">*/}
                  {/*  <Text fz="xl">{component['Цена'][0]}</Text>*/}
                  {/*  <Text fz="xl">{component['Цена'][1]}</Text>*/}
                  {/*  <Button>Добавить в сборку</Button>*/}
                  {/*</Stack>*/}
                </Group>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          {/*<Grid.Col span={12} sm="content">*/}
          {/*  {rightSide}*/}
          {/*</Grid.Col>*/}
        </Grid>
      </Block>
    </Box>
  );
};
