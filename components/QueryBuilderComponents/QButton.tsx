import { Button } from '@mantine/core';
import { ActionWithRulesProps } from 'react-querybuilder';

export const QButton = (props: ActionWithRulesProps) => (
  <Button onClick={props.handleOnClick}>{props.label}</Button>
);
