export type Columns = Array<{
  type?: string,
  prop: string,
  label?: string,
  width?: number,
  hidden?: boolean,
  children?: Array<Columns>,
  display?: boolean,
  translate?: {
    key?: string,
    value?: string
    remoteOptions: Promise<Array<any>>,
  },
  formatter?: (row: Object, column: string, cellValue: any, index: number) => {},
  addition?: {
    type: string,
    prop?: string,
    label?: string,
    showMessage?: boolean,
    inlineMessage?: boolean,
    size?: string,
    disabled?: boolean,
    isShow?: boolean,
    rules?: Array<any>,
    attrs?: Object,
    events?: Array<any>
  },
  edition?: {
    type: string,
    prop?: string,
    label?: string,
    showMessage?: boolean,
    inlineMessage?: boolean,
    size?: string,
    disabled?: boolean,
    isShow?: boolean,
    rules?: Array<any>,
    attrs?: Object,
    events?: Array<any>
  }
}>

export type Operations = Array<{
  label: string,
  sort?: number,
  attrs?: {
    type: string
  },
  emit: () => {}
}>