import { ActionIcon, Box, Button, Container, Group, MediaQuery, Menu, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconCirclePlus, IconDotsVertical, IconPencil } from '@tabler/icons-react';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';
import { PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';
import { NextLink } from '../../../components/Layout/general/NextLink/NextLink';
import { ComponentsList } from '../../../components/Layout/specific/ComponentsList/ComponentsList';

export default function CategoryPage() {
  const router = useRouter();

  const { user } = useAuth();

  const { data: templateData, isSuccess } = useTemplateData(router.query.categoryId as string);

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader
          title={isSuccess ? templateData.name : ''}
          addBack
          rightSection={
            user && (
              <Box>
                <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                  <Group>
                    <Button
                      leftIcon={<IconPencil />}
                      href={`/templates/edit/${router.query.categoryId}`}
                      component={NextLink}
                    >
                      Изменить
                    </Button>
                    <Button
                      href={`/components/create?templateId=${router.query.categoryId}`}
                      component={NextLink}
                      leftIcon={<IconCirclePlus />}
                    >
                      Добавить
                    </Button>
                  </Group>
                </MediaQuery>
                <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                  <Menu>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconPencil size={18} />}
                        href={`/templates/edit/${router.query.categoryId}`}
                        component={NextLink}
                      >
                        Изменить шаблон
                      </Menu.Item>
                      <Menu.Item
                        icon={<IconCirclePlus size={18} />}
                        href={`/components/create?templateId=${router.query.categoryId}`}
                        component={NextLink}
                      >
                        Добавить компонент
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </MediaQuery>
              </Box>
            )
          }
        />
        <ComponentsList categoryId={router.query.categoryId as string} />
      </Stack>
    </Container>
  );
}
