import { ActionIcon, Grid, Group, MediaQuery, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconArrowLeft } from '@tabler/icons-react';
import { Block } from '../Block/Block';

export const PageHeader = ({
  rightSection,
  leftSection,
  title,
  addBack,
}: {
  rightSection?: any;
  leftSection?: any;
  title: string;
  addBack?: boolean;
}) => {
  const router = useRouter();
  return (
    <Block>
      <Grid>
        <Grid.Col span="auto">
          <Group sx={{ height: '100%' }} noWrap>
            {addBack && (
              <ActionIcon onClick={() => router.back()}>
                <IconArrowLeft />
              </ActionIcon>
            )}
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
};
