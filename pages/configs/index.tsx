import { Container, Grid } from '@mantine/core';
import React from 'react';
import { Block, PageHeader } from '../../components/Layout';

export default function Configs() {
  return (
    <Container size="xl" sx={{ height: '100%' }}>
      <PageHeader title="Пользовательские сборки" />
      <Grid columns={48} mt="md">
        <Grid.Col span={12} sx={{ height: '100%' }}>
          <Block sx={{ height: '45rem' }}>Filters</Block>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
