import {
  Box,
  Button,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  MediaQuery,
  Paper,
  Stack,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';
import { Block, PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';
import { useComponentsList } from '../../../components/hooks/components';
import { Filters } from '../../../components/Layout/inputs/Filters/Filters';
import { ComponentRow } from '../../../components/Layout/general/ComponentRow/ComponentRow';
import { NextLink } from '../../../components/Layout/general/NextLink/NextLink';
import { ComponentsList } from '../../../components/Layout/specific/ComponentsList/ComponentsList';

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.sm,
  },
  box: {
    position: 'relative',
    width: '100%',
    borderRadius: theme.radius.md,
    '&:before': {
      content: "''",
      display: 'block',
      paddingTop: '100%',
    },
  },
  boxContent: {
    position: 'absolute',
    padding: theme.spacing.sm,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  drawerButton: {
    width: '100%',
  },
}));
export default function Category() {
  const router = useRouter();

  const { user } = useAuth();

  const { data: templateData, isSuccess } = useTemplateData(router.query.categoryId as string);

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader
          title={isSuccess ? templateData.name : ''}
          rightSection={
            <Group>
              {user && user.role === 'ADMIN' && (
                <Button href={`/templates/edit/${router.query.categoryId}`} component={NextLink}>
                  Изменить
                </Button>
              )}
              {user && user.role === 'ADMIN' && (
                <Button
                  href={`/components/create?templateId=${router.query.categoryId}`}
                  component={NextLink}
                >
                  Добавить
                </Button>
              )}
              <Button href="/components" component={NextLink}>
                Назад
              </Button>
            </Group>
          }
        />
        <ComponentsList categoryId={router.query.categoryId as string} />
      </Stack>
    </Container>
  );
}
