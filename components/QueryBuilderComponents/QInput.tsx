import { TextInput } from '@mantine/core';
import { ValueEditorProps } from 'react-querybuilder';

export const QInput = (props: ValueEditorProps) => (
  <TextInput
    value={props.value}
    onChange={(event) => props.handleOnChange(event.currentTarget.value)}
  />
);
