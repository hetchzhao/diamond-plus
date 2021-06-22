import {
  PropType,
  defineComponent,
  inject,
  onMounted,
  Suspense
} from 'vue'
import _, { trim } from 'lodash';
import { ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-table.css';
import 'element-plus/lib/theme-chalk/el-alert.css';
import 'element-plus/lib/theme-chalk/el-button.css';

import Form from '../form';

import Toolbar from './toolbar';
import ChildTable from './child-table';

import { Tools, Operations, Columns } from './token';
import { Criterions } from '../form/token'
import { IObjectKeys } from '../utils';

const SELECTION = 'selection';
export default defineComponent({
  name: 'dia-table',
  components: {
    ElButton
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    columns: {
      type: Array as PropType<Columns>,
      default: []
    },
    size: String,
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    fit: {
      type: Boolean,
      default: true
    },
    stripe: Boolean,
    border: Boolean,
    rowKey: [String, Function],
    showHeader: {
      type: Boolean,
      default: true
    },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          hasChildren: 'hasChildren',
          children: 'children',
        }
      },
    },
    lazy: Boolean,
    load: Function,
    defaultTools: {
      type: String,
      default: 'add, delete'
    },
    tools: {
      type: Array as PropType<Tools>,
      default: []
    },
    defaultOperations: {
      type: String,
      default: 'query,edit,'
    },
    operations: {
      type: Array as PropType<Operations>,
      default: []
    },
    beforeAdd: {
      type: Function,
      default: () => {}
    },
    add: {
      type: Function,
      default: () => {}
    },
    afterAdd: {
      type: Function,
      default: () => {}
    },
    beforeRemove: {
      type: Function,
      default: () => {}
    },
    remove: {
      type: Function,
      default: () => {}
    },
    afterRemove: {
      type: Function,
      default: () => {}
    },
    beforeEdit: {
      type: Function,
      default: () => {}
    },
    edit: {
      type: Function,
      default: () => {}
    },
    afterEdit: {
      type: Function,
      default: () => {}
    },
    beforeQuery: {
      type: Function,
      default: () => {}
    },
    query: {
      type: Function,
      default: () => {}
    },
    afterQuery: {
      type: Function,
      default: () => {}
    }
  },
  emits: [],
  setup(props, { emit, slots }) {
    const context: IObjectKeys = {
      clearSelection: () => {},
      toggleRowSelection: () => {},
      toggleAllSelection: () => {},
      toggleRowExpansion: () => {},
      setCurrentRow: () => {},
      clearSort: () => {},
      clearFilter: () => {},
      doLayout: () => {},
      sort: () => {},
      openDialog: () => {},
      closeDialog: () => {},
      createForm: () => Form,
      getSelectedRows: () => {},
      setSelectedRows: () => {}
    };
    const packageContext = (fn: any, props?: any) => function() {
      fn(context, props, ...arguments);
    };

    let selectedRows: Array<any> = [];
    const handleSelectionChange = (val: any) => selectedRows = val;
    const getSelectedRows = () => selectedRows;
    const setSelectedRows = () => {};
    context.getSelectedRows = getSelectedRows;
    context.setSelectedRows = setSelectedRows;

    const openDialog = inject('openDialog') || null;
    const closeDialog = inject('closeDialog') || null;
    if(typeof openDialog === 'function') {
      context.openDialog = openDialog;
    }
    if(typeof closeDialog === 'function') {
      context.closeDialog = closeDialog;
    }


    const mergeTools = (defaultTools:string, tools: Tools, options: IObjectKeys) => {
      let mergedTools: Tools = [];
      let deletable = false;
      const {
        columns,
        beforeAdd,
        add,
        afterAdd,
        beforeRemove,
        remove,
        afterRemove
      } = options;
      const additionCriterions: Criterions = [];
      const traverse = function(columns: Columns, additionCriterions: Criterions) {
        if(!Array.isArray(columns)) return;

        for(let column of columns) {
          const { prop, label, type, addition, children } = column;

          if(Array.isArray(children)) {
            traverse(children, additionCriterions);
          }

          if(type === SELECTION) {
            deletable = true;
          }

          if(!prop) continue;

          const criterion = {
            prop,
            label,
            type: 'input',
            attrs: {},
            rules: [],
            events: [],
            hidden: false,
          };

          if(typeof addition === 'object' && addition !== null) {
            additionCriterions.push(_.merge({}, criterion, {
              type: addition.type,
              prop: addition.prop,
              label: addition.label,
              showMessage: addition.showMessage,
              inlineMessage: addition.inlineMessage,
              size: addition.size,
              disabled: addition.disabled,
              rules: addition.rules,
              attrs: addition.attrs,
              events: addition.events,
              isShow: addition.isShow
            }))
          }
        }
      };
      const openAdditionDialog = function(context: IObjectKeys) {
        const Form = context.createForm();
        const props:IObjectKeys = {
          inline: false,
          criterions: additionCriterions,
          labelWidth: "80px",
          onSubmit: packageContext(add),
        };
        const newProps = beforeAdd(_.cloneDeep(props) || {});

        context.openDialog({
          title: '新增',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }, Form, newProps && typeof newProps == 'object' ? newProps : props);
        afterAdd();
      };
      const removeRows = function(context: IObjectKeys) {
        const selectedRows = context.getSelectedRows();

        if(selectedRows.length < 1) {
          return;
        }

        beforeRemove(selectedRows);
        remove(selectedRows);
        afterRemove();
      };
      const toolMap = {
        add: {
          label: '新增',
          attrs: { type: 'primary' },
          sort: 0,
          emit: openAdditionDialog,
        },
        delete: {
          label: '删除',
          attrs: { type: 'danger' },
          sort: 0,
          emit: removeRows,
        }
      };

      traverse(columns, additionCriterions);

      let index = 1;
      defaultTools.split(",").forEach((key: string) => {
        key = trim(key);

        if(!toolMap[key] || key === 'delete' && !deletable) return;
        
        mergedTools.push({
          label: toolMap[key].label || '',
          attrs: toolMap[key].attrs,
          sort: index,
          emit: packageContext(toolMap[key].emit)
        });
        index++;
      });

      if(Array.isArray(tools) && tools.length > 0) {
        tools.forEach(tool => {
          mergedTools.push({
            label: tool.label,
            attrs: tool.attrs || {},
            sort: tool.sort, 
            emit: packageContext(emit)
          });
        });
      }

      mergedTools = mergedTools.sort(function(cur: any, next:any) {
        return cur.sort && next.sort && cur.sort - next.sort;
      });

      return mergedTools;
    }

    const generateOperationsFn = (defaultOperations: string, operations: Operations, options: IObjectKeys) => {
      let mergedOperations: Operations = [];
      const {
        columns,
        beforeEdit,
        edit,
        afterEdit,
      } = options;
      const editionCriterions: Criterions  = [];
      const traverse = function(columns: Columns, editionCriterions: Criterions) {
        if(!Array.isArray(columns)) return;

        for(let column of columns) {
          const { prop, label, edition, children } = column;

          if(Array.isArray(children)) {
            traverse(children, editionCriterions);
          }

          if(!prop) continue;

          const criterion = {
            prop,
            label,
            type: 'input',
            attrs: {},
            rules: [],
            events: [],
            hidden: false,
          };

          if(typeof edition === 'object' && edition !== null) {
            editionCriterions.push(_.merge({}, criterion, {
              type: edition.type,
              prop: edition.prop,
              label: edition.label,
              showMessage: edition.showMessage,
              inlineMessage: edition.inlineMessage,
              size: edition.size,
              disabled: edition.disabled,
              rules: edition.rules,
              attrs: edition.attrs,
              events: edition.events,
              isShow: edition.isShow
            }))
          }
        }
      };
      const openEditionDialog = function(context: IObjectKeys, tableProps: IObjectKeys) {
        const { row } = tableProps;

        for(let i = 0; i < editionCriterions.length; i++) {
          editionCriterions[i].modelValue = row[editionCriterions[i].prop] || "";
        }

        const Form = context.createForm();
        const props = {
          inline: false,
          criterions: editionCriterions,
          labelWidth: "80px",
          onSubmit: packageContext(edit)
        };

        const newProps = beforeEdit(_.cloneDeep(props) || {});

        context.openDialog({
          title: '编辑',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }, Form, newProps && typeof newProps == 'object' ? newProps : props);
        afterEdit();
      };
      const openQueryDialog = function(context: IObjectKeys, props: IObjectKeys) {};
      const operationMap: IObjectKeys= {
        query: {
          label: '查看',
          attrs: { type: 'text' },
          sort: 0,
          emit: openQueryDialog,
        },
        edit: {
          label: '编辑',
          attrs: { type: 'text' },
          sort: 0,
          emit: openEditionDialog,
        }
      };

      traverse(columns, editionCriterions);

      let index = 1;
      defaultOperations.split(",").forEach((key: string) => {
        key = trim(key);
        if(!operationMap[key]) return;

        mergedOperations.push({
          label: operationMap[key].label || '',
          attrs: operationMap[key].attrs,
          sort: index,
          emit: typeof operationMap[key].emit === 'function' ? operationMap[key].emit : () => {}
        });
        index++;
      });

      if(Array.isArray(operations) && operations.length > 0) {
        operations.forEach(operation => {
          mergedOperations.push({
            label: operation.label,
            attrs: operation.attrs || { type: 'primary' },
            sort: operation.sort, 
            emit: typeof operation.emit === 'function' ? operation.emit : () => {}
          });
        });
      }

      mergedOperations = mergedOperations.sort(function(cur: any, next:any) {
        return cur.sort && next.sort && cur.sort - next.sort;
      });

      return (props: IObjectKeys) => mergedOperations.map(
        ({label, attrs, emit}) => (
          // @ts-ignore
          <ElButton type={attrs.type} onClick={packageContext(emit, props)}>{label}</ElButton>
        )
      )
    };

    return {
      mergeTools,
      handleSelectionChange,
      generateOperationsFn,
    }
  },
  render() {
    const operationsFn = this.generateOperationsFn(
      this.defaultOperations,
      this.operations,
      {
        columns: this.columns,
        beforeEdit: this.beforeEdit,
        edit: this.edit,
        afterEdit: this.afterEdit,
        beforeQuery: this.beforeQuery,
        query: this.query,
        afterQuery: this.afterQuery
      }
    );

    return (
      <Suspense>
        {{
          default:() => {
            const slot: IObjectKeys= {
              operation: (props: any) => operationsFn(props)
            };

            Object.keys(this.$slots).forEach(key => {
              slot[key] = this.$slots[key];
            });

            return (
              <>
                <Toolbar tools={
                  this.mergeTools(
                    this.defaultTools, 
                    this.tools, 
                    {
                      columns: this.columns,
                      beforeAdd: this.beforeAdd,
                      add: this.add,
                      afterAdd: this.afterAdd,
                      beforeRemove: this.beforeRemove,
                      remove: this.remove,
                      afterRemove: this.afterRemove
                    }
                  )}
                />
                <ChildTable
                  data={this.data}
                  columns={this.columns}
                  size={this.size}
                  width={this.width}
                  height={this.height}
                  maxHeight={this.maxHeight}
                  fit={this.fit}
                  stripe={this.stripe}
                  border={this.border}
                  rowKey={this.rowKey}
                  showHeader={this.showHeader}
                  showSummary={this.showSummary}
                  sumText={this.sumText}
                  summaryMethod={this.summaryMethod}
                  rowClassName={this.rowClassName}
                  rowStyle={this.rowStyle}
                  cellClassName={this.cellClassName}
                  cellStyle={this.cellStyle}
                  headerRowClassName={this.headerRowClassName}
                  headerRowStyle={this.headerRowStyle}
                  headerCellClassName={this.headerCellClassName}
                  headerCellStyle={this.headerCellStyle}
                  highlightCurrentRow={this.highlightCurrentRow}
                  currentRowKey={this.currentRowKey}
                  emptyText={this.emptyText}
                  expandRowKeys={this.expandRowKeys}
                  defaultExpandAll={this.defaultExpandAll}
                  defaultSort={this.defaultSort}
                  tooltipEffect={this.tooltipEffect}
                  spanMethod={this.spanMethod}
                  selectOnIndeterminate={this.selectOnIndeterminate}
                  indent={this.indent}
                  treeProps={this.treeProps}
                  lazy={this.lazy}
                  load={this.load}
                  // @ts-ignore
                  onSelectionChange={this.handleSelectionChange}
                >
                  {slot}
                </ChildTable>
              </>
          )},
          fallback: () => '加载中'
        }}
      </Suspense>
    );
  },
})