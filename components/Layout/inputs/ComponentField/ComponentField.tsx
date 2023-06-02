import { createStyles, Group, Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IComponentFieldValue } from '../../../../types/Constraints';
import { useTemplateData, useTemplatesList } from '../../../hooks/templates';

const useStyles = createStyles((theme) => ({
  fullWidth: {
    [theme.fn.smallerThan('md')]: {
      width: '100%',
    },
  },
}));

export const ComponentField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: IComponentFieldValue;
  onChange?: any;
}) => {
  const { classes } = useStyles();
  const { data: templates, isSuccess: isTemplatesLoaded } = useTemplatesList();
  const [componentId, setComponentId] = useState<string | null>(value?.componentId || '');
  const { data: templateData, isSuccess: isTemplateLoaded } = useTemplateData(
    componentId as string
  );
  const [fieldId, setFieldId] = useState<string | null>(value?.fieldId || '');

  const handleComponentId = (newComponentId) => {
    if (newComponentId !== componentId) setFieldId(null);
    setComponentId(newComponentId);
  };

  useEffect(() => {
    onChange && onChange({ componentId, fieldId });
  }, [componentId, fieldId]);

  return (
    <Group className={classes.fullWidth}>
      <Select
        data={
          isTemplatesLoaded
            ? templates.map((t) => ({
                label: t.name,
                value: t.id,
              }))
            : []
        }
        label={label}
        value={componentId}
        onChange={handleComponentId}
        className={classes.fullWidth}
      />
      <Select
        label="Поле компонента"
        data={
          isTemplateLoaded
            ? templateData.fields
                .filter((f) => f.editable)
                .map((f) => ({ label: f.name, value: f.id }))
            : []
        }
        value={fieldId}
        onChange={setFieldId}
        className={classes.fullWidth}
      />
    </Group>
  );
};
