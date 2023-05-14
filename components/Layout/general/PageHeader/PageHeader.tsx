import { Grid, Group, MediaQuery, Title } from '@mantine/core';
import { Block } from '../Block/Block';

export const PageHeader = ({
  rightSection,
  leftSection,
  title,
}: {
  rightSection?: any;
  leftSection?: any;
  title: string;
}) => (
  <Block>
    <Grid>
      <Grid.Col span="auto">
        <Group sx={{ height: '100%' }} noWrap>
          {leftSection}
          <MediaQuery styles={(theme) => ({ fontSize: theme.fontSizes.xl })} smallerThan="sm">
            <Title order={3}>{title}</Title>
          </MediaQuery>
        </Group>
      </Grid.Col>
      <Grid.Col span="content">{rightSection}</Grid.Col>
    </Grid>
  </Block>
);
