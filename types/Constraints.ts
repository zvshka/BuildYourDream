export interface IComponentFieldValue {
  componentId?: string;
  fieldId?: string;
}

export interface IConstraintFieldValue {
  leftSide: IComponentFieldValue;
  rightSide: IComponentFieldValue;
  constraint: string;
}
