import {
  Accordion,
  Checkbox,
  createStyles,
  Group,
  NumberInput,
  Paper,
  Select,
  Slider,
  Stack,
  TextInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { IField } from '../../../types/Field';
import { useTemplatesList } from '../../hooks/templates';
import {
  BOOL,
  DEPENDS_ON,
  LARGE_TEXT,
  NUMBER,
  RANGE,
  SELECT,
  TEXT,
} from '../../../types/FieldTypes';

const boolValues = [
  { value: 'all', label: 'Все' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];

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

export const Filters = ({ fields }: { fields: IField[] }) => {
  const router = useRouter();
  const { classes } = useStyles();
  const { data: templates, isFetched, isSuccess } = useTemplatesList();
  // const [values, setValues] = useState([]);
  //
  // useEffect(() => {
  //   if (isFetched && isSuccess) {
  //     // const data = templates
  //     //   .find((t) => t.id === field.depends_on?.template)
  //     //   ?.fields.find((f) => f.id === field.depends_on?.field).options;
  //     const template = templates.find(t => t.id === )
  //     setValues(data);
  //   }
  // }, [isFetched, isSuccess]);

  const getValues = (field: IField) => {
    if (!isFetched || !isSuccess) return [];
    const template = templates.find((t) => t.id === field.depends_on?.template);
    if (!template) return [];
    const templateField = template.fields.find((f) => f.id === field.depends_on?.field);
    if (!templateField) return [];
    return templateField.options || [];
  };

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);

  useEffect(() => {
    router.replace({
      query: { ...router.query, search: debouncedSearch },
    });
  }, [debouncedSearch]);

  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <TextInput onChange={(event) => setSearch(event.currentTarget.value)} />
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
              .filter((field: any) => ![TEXT, LARGE_TEXT].includes(field.type))
              .map((field: any) => (
                <Accordion.Item value={field.name} key={field.name}>
                  <Accordion.Control>{field.name}</Accordion.Control>
                  <Accordion.Panel>
                    {field.type === SELECT && (
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
                    {(field.type === RANGE || field.type === NUMBER) && (
                      <Group grow>
                        <NumberInput placeholder="От" />
                        <NumberInput placeholder="До" />
                      </Group>
                    )}
                    {field.type === BOOL && <Select data={boolValues} defaultValue="all" />}
                    {field.type === DEPENDS_ON && (
                      <Checkbox.Group orientation="vertical">
                        {getValues(field).map((option: string, key: number) => (
                          <Checkbox
                            label={option}
                            value={option}
                            key={`${field.name}_option_${key}`}
                          />
                        ))}
                      </Checkbox.Group>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
        </Accordion>
      </Paper>
    </Stack>
  );
};
