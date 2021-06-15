import { IObjectKeys } from '../utils' 

export type ComponentSize = 'large' | 'medium' | 'small' | 'mini';
export type ComponentName = string;
export type ComponentDisabled = boolean;

export type Rule = any;
export type Rules = Array<Rule>;
export type Attrs = IObjectKeys;
export type Events = IObjectKeys;
export type Criterion = {
  type: string,
  prop: string,
  label?: string,
  defaultModeValue?: any,
  size?: string,
  disabled?: boolean,
  showMessage?: boolean,
  inlineMessage?: boolean,
  isShow?: boolean,
  rules?: Rules,
  events?: Events,
  attrs?: Attrs
}
export type Criterions = Array<Criterion>;
export type AttributeOption = {
  label: string,
  value: string | number | object
};
export type AttributeOptions = Array<AttributeOption>;
