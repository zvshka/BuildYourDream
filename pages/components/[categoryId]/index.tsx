import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  Image,
  MediaQuery,
  NumberInput,
  Paper,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';
import { useAuth } from '../../../components/Providers/Auth/AuthWrapper';
import { Block } from '../../../components/Layout/Block/Block';
import { PageHeader } from '../../../components/Layout';
import { ITemplate } from '../../../types/Template';

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

const boolValues = [
  { value: 'all', label: 'Все' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];

const Filters = ({ fields }: any) => {
  const { classes } = useStyles();
  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <TextInput />
      </Paper>
      <Paper className={classes.container} shadow="xl">
        <Accordion variant="filled">
          <Accordion.Item value="tier">
            <Accordion.Control>Тир компонента</Accordion.Control>
            <Accordion.Panel>
              <Slider
                step={50}
                label={null}
                marks={[
                  { value: 0, label: 'Low' },
                  { value: 50, label: 'Medium' },
                  { value: 100, label: 'High' },
                ]}
                mb="sm"
              />
            </Accordion.Panel>
          </Accordion.Item>
          {fields &&
            fields
              .filter((field: any) => !['TEXT', 'LARGE_TEXT'].includes(field.type))
              .map((field: any) => (
                <Accordion.Item value={field.name}>
                  <Accordion.Control>{field.name}</Accordion.Control>
                  <Accordion.Panel>
                    {field.type === 'SELECT' && (
                      <Checkbox.Group orientation="vertical">
                        {field.options.map((option: string, key: number) => (
                          <Checkbox
                            label={option}
                            value={option}
                            key={`${field.name}_option_${key}`}
                          />
                        ))}
                      </Checkbox.Group>
                    )}
                    {(field.type === 'RANGE' || field.type === 'NUMBER') && (
                      <Group grow>
                        <NumberInput placeholder="От" />
                        <NumberInput placeholder="До" />
                      </Group>
                    )}
                    {field.type === 'BOOL' && <Select data={boolValues} defaultValue="all" />}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
        </Accordion>
      </Paper>
    </Stack>
  );
};
export default function Category() {
  const router = useRouter();
  const { classes } = useStyles();
  const [showFilters, toggleFilters] = useToggle();

  const [templateData, setTemplateData] = useState<ITemplate & { id: string }>();
  const [components, setComponents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/templates/${router.query.categoryId}`).then((res) => setTemplateData(res.data));
    axios
      .get(`/api/templates/${router.query.categoryId}/list`)
      .then((res) => setComponents(res.data));
  }, []);

  return (
    <Stack>
      <PageHeader
        title={templateData?.name ?? ''}
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
      <Box>
        <Container size={1600} p={0}>
          <Grid>
            <Grid.Col lg={3}>
              <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                <Box>
                  <Filters fields={templateData?.fields} />
                </Box>
              </MediaQuery>
              <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
                <Paper className={classes.container} shadow="xl">
                  <Button onClick={() => toggleFilters()} className={classes.drawerButton}>
                    Показать фильтры
                  </Button>
                </Paper>
              </MediaQuery>
            </Grid.Col>
            <Grid.Col lg={9}>
              <Stack>
                {components.length > 0 &&
                  components.map((component: any) => (
                    <Block
                      href={`/components/${router.query.categoryId}/${component.id}`}
                      key={component.id}
                      component={NextLink}
                    >
                      <Group align="normal">
                        <Image
                          withPlaceholder
                          radius="sm"
                          width={256 / 1.5}
                          height={256 / 1.5}
                          {...(component.data.image
                            ? { src: `${component.data.image.url}?quality=60` }
                            : {})}
                        />
                        <Box>
                          <Title order={3}>{component.data['Название']}</Title>
                          <Text>
                            Примерная цена: {component.data['Цена'][0]} -{' '}
                            {component.data['Цена'][1]} Руб.
                          </Text>
                          <Text>
                            Tier компонента:{' '}
                            {component.data.tier === 0
                              ? 'Low'
                              : component.data.tier === 50
                              ? 'Medium'
                              : 'High'}
                          </Text>
                        </Box>
                      </Group>
                    </Block>
                  ))}
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Drawer
        opened={showFilters}
        onClose={() => toggleFilters()}
        title="Фильтры и поиск"
        padding="xl"
        size="xl"
      >
        <Filters fields={templateData?.fields} />
      </Drawer>
    </Stack>
  );
}
