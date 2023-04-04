import { Select } from '@mantine/core';
import { BaseSelectorProps } from 'react-querybuilder';

export const QSelect = (props: BaseSelectorProps) => (
  <Select
    value={props.value}
    onChange={props.handleOnChange}
    data={props.options.map((option) => ({
      label: option.label,
      value: option.name,
    }))}
  />
);
