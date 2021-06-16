import { Criterion, Criterions } from '../form/token'

export type Columns = Array<{
  type?: string,
  prop: string,
  label?: string,
  width?: number,
  hidden?: boolean,
  children?: Columns,
  display?: boolean,
  translate?: {
    key?: string,
    value?: string
    API: Promise<Array<any>>,
  },
  formatter?: (row: Object, column: string, cellValue: any, index: number) => {},
  addition?: Criterions,
  edition?: Criterions
}>

export type Operation = {
  label: string,
  sort?: number,
  attrs?: {
    type: string
  },
  emit?: () => void
}
export type Operations = Array<Operation>
export type Tool = {
  label: string,
  sort?: number,
  attrs?: {
    type?: string
  },
  emit?: () => void
}
export type Tools = Array<Tool>

