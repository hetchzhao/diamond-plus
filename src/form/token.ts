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
export interface SelectOption {
  label: string,
  value: string | number | object,
};
export interface CascaderOption {
  label?: string
  value?: string | number,
  children?: CascaderOption[]
  disabled?: boolean
  leaf?: boolean
}
enum ExpandTrigger {
  CLICK = 'click',
  HOVER = 'hover'
}
export interface CascaderProps {
  expandTrigger?: ExpandTrigger
  multiple?: boolean
  checkStrictly?: boolean
  emitPath?: boolean
  lazy?: boolean
  lazyLoad?: (node: any, resolve: any) => void
  value?: string
  label?: string
  children?: string
  disabled?: string | ((data: any, node: any) => boolean)
  leaf?: string | ((data: any, node: any) => boolean)
  hoverThreshold?: number
}

export type AttributeOptions = Array<SelectOption | CascaderOption>;
