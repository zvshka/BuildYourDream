import {
  Box,
  Button,
  Collapse,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  Image,
  MediaQuery,
  Modal,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import React, { useRef } from 'react';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { Block, PageHeader } from '../components/Layout';
import { useTemplateData, useTemplatesList } from '../components/hooks/templates';
import { IComponent, ITemplate } from '../types/Template';
import { useComponentData, useComponentsList } from '../components/hooks/components';
import { useAuth } from '../components/Providers/Auth/AuthWrapper';
import { Filters } from '../components/Layout/Filters/Filters';
import { ComponentRow } from '../components/Layout/ComponentRow/ComponentRow';

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
  componentRow: {
    '&:hover': {
      cursor: 'pointer',
      boxShadow: '5px 5px 5px gray',
    },
  },
}));
const ComponentsSelect = ({ template, onChange, required }) => {
  const { classes } = useStyles();
  const [showFilters, toggleFilters] = useToggle();
  const { data: templateData } = useTemplateData(template.id);
  const { data: components, isFetched: isComponentsFetched } = useComponentsList(template.id);
  return (
    <Stack>
      <PageHeader title={templateData?.name ?? ''} />
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
                {isComponentsFetched &&
                  components.map((component: IComponent) => (
                    <Block
                      key={component.id}
                      onClick={() => onChange(component.id)}
                      className={classes.componentRow}
                    >
                      <ComponentRow component={component} />
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
};

const TemplateRow = ({
  template,
  index,
  onChange,
  value,
}: {
  template: ITemplate;
  index: number;
  onChange: any;
  value: string;
}) => {
  const [opened, toggle] = useToggle();
  const { data: componentData, isFetched } = useComponentData(value);

  const handleChange = (v) => {
    onChange(v);
    toggle();
  };

  return (
    <Box>
      <Box
        sx={{
          height: '5rem',
          border: '1px solid gray',
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
          ...(index === 0 ? { border: 0 } : {}),
        }}
        px="md"
      >
        <Group position="apart" align="center" sx={{ height: '100%' }}>
          {!value && (
            <Text>
              {template.name} {template.required ? '*' : ''}
            </Text>
          )}
          {value && (
            <Group>
              <Image width={64} height={64} src={isFetched && componentData.data.image.url} />
              <Text>{isFetched && componentData.data['Название']}</Text>
            </Group>
          )}
          {!value && (
            <Button sx={{ width: 150 }} onClick={() => toggle()}>
              {!opened ? '+ Добавить' : '- Свернуть'}
            </Button>
          )}
          {value && (
            <Button sx={{ width: 150 }} onClick={() => handleChange('')}>
              <Text>- Убрать</Text>
            </Button>
          )}
        </Group>
      </Box>
      <Collapse in={opened} transitionDuration={0}>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'light' ? theme.colors.gray[3] : theme.colors.gray[9],
            padding: theme.spacing.xl,
          })}
        >
          <ComponentsSelect
            template={template}
            onChange={handleChange}
            required={template.required}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default function HomePage() {
  const { data: templates, isFetched } = useTemplatesList();
  const [modalVisible, toggleModal] = useToggle();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
    },
  });

  const { user } = useAuth();

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Stack>
      <PageHeader title="Конфигуратор" />
      <Block p={0}>
        <form ref={formRef} onSubmit={form.onSubmit(handleSubmit)}>
          <Modal
            opened={modalVisible}
            withinPortal
            onClose={() => toggleModal()}
            target={formRef.current as HTMLElement}
            title="Сохранение сборки"
          >
            <Stack>
              <TextInput label="Название сборки" required {...form.getInputProps('title')} />
              <Textarea label="Описание сборки" required {...form.getInputProps('description')} />
              <Button type="submit">Сохранить</Button>
            </Stack>
          </Modal>
          <Stack spacing="xs">
            <Box>
              {isFetched &&
                templates
                  .filter((template: any) => template.showInConfigurator)
                  .map((template: ITemplate, i: number) => (
                    <TemplateRow
                      template={template}
                      key={template.id}
                      index={i}
                      {...form.getInputProps(template.id as string)}
                    />
                  ))}
            </Box>
          </Stack>
        </form>
      </Block>
      <Group position="center" mt="xl">
        <Button onClick={() => toggleModal()} sx={{ width: 300 }} disabled={!user?.id}>
          Сохранить
        </Button>
      </Group>
    </Stack>
  );
}
