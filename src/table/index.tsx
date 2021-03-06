import {
  PropType,
  defineComponent,
  provide,
  inject,
  ref,
  onMounted,
  toRefs,
  Suspense,
  reactive,
} from 'vue'
import _, { trim } from 'lodash';
import { ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-table.css';
import 'element-plus/lib/theme-chalk/el-alert.css';
import 'element-plus/lib/theme-chalk/el-button.css';

import Form from '../form'
import { Columns, Operations } from './token'

import Toolbar from './toolbar';
import ChildTable from './child-table';

const SELECTION = 'selection';
export default defineComponent({
  name: 'dia-table',
  // TODO: 全量加载时不需要注册组件，查看下原因
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
      type: Array,
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
  // async setup(props, { slots, emit }) {
  //   const { columns, operations, defaultOperation } = toRefs(props);

  //   const context = {
  //     clearSelection: () => {},
  //     toggleRowSelection: () => {},
  //     toggleAllSelection: () => {},
  //     toggleRowExpansion: () => {},
  //     setCurrentRow: () => {},
  //     clearSort: () => {},
  //     clearFilter: () => {},
  //     doLayout: () => {},
  //     sort: () => {},
  //     openDialog: () => {},
  //     closeDialog: () => {},
  //     createForm: () => Form,
  //     getSelectedRows: () => {},
  //     setSelectedRows: () => {}
  //   };
  //   const packageContext = (fn: any) => function() {
  //     fn(context, ...arguments);
  //   }

  //   const openDialog = inject('openDialog') || null;
  //   const closeDialog = inject('closeDialog') || null;
  //   if(typeof openDialog === 'function') {
  //     context.openDialog = openDialog;
  //   }
  //   if(typeof closeDialog === 'function') {
  //     context.closeDialog = closeDialog;
  //   }

  //   let selectedRows: any = [];
  //   const handleSelectionChange = (val: any) => {
  //     selectedRows = val;
  //   }
  //   const getSelectedRows = () => selectedRows;
  //   const setSelectedRows = () => {};
  //   context.getSelectedRows = getSelectedRows;
  //   context.setSelectedRows = setSelectedRows;

  //   /**
  //    * generate operationButtons
  //    */
  //   const {
  //     beforeAdd,
  //     add,
  //     afterAdd,
  //     beforeEdit,
  //     edit,
  //     afterEdit,
  //     beforeRemove,
  //     remove,
  //     afterRemove
  //   } = props;

  //   const renderOperationButtons = () => {
  //     const additionCriterions: any = [];
  //     const editionCriterions: any = [];
  //     const columnsVal = columns.value;
  //     let deletable = false;
  //     let editable = false;

  //     /**
  //      * generate addition criterions and edition Criterions
  //      */
  //     const traverse = function(columns: Columns, additionCriterions: Array<any>, editionCriterions: Array<any>) {
  //       if(!Array.isArray(columns)) return;

  //       for(let column of columns) {
  //         const { label, type, prop, addition, edition, children } = column;

  //         if(Array.isArray(children)) {
  //           traverse(children, additionCriterions, editionCriterions);
  //         }

  //         // verify delete and edit operation
  //         if(type === SELECTION) {
  //           deletable = true;
  //           editable = true;
  //         }

  //         // generate criterions
  //         if(!prop) continue;

  //         const criterion = {
  //           prop,
  //           label,
  //           type: 'input',
  //           attrs: {},
  //           rules: [],
  //           events: [],
  //           // TODO: 新增hidden字段
  //           hidden: false
  //         };

  //         if(typeof addition === 'object' && addition !== null) {
  //           additionCriterions.push(_.merge({}, criterion, {
  //             type: addition.type,
  //             prop: addition.prop,
  //             label: addition.label,
  //             showMessage: addition.showMessage,
  //             inlineMessage: addition.inlineMessage,
  //             size: addition.size,
  //             disabled: addition.disabled,
  //             rules: addition.rules,
  //             attrs: addition.attrs,
  //             events: addition.events,
  //             isShow: addition.isShow
  //           }));
  //         }
  //         if(typeof edition === 'object' && edition !== null) {
  //           editionCriterions.push(_.merge({}, criterion, {
  //             type: edition.type,
  //             prop: edition.prop,
  //             label: edition.label,
  //             showMessage: edition.showMessage,
  //             inlineMessage: edition.inlineMessage,
  //             size: edition.size,
  //             disabled: edition.disabled,
  //             rules: edition.rules,
  //             attrs: edition.attrs,
  //             events: edition.events,
  //             isShow: edition.isShow,
  //           }));
  //         }
  //       }
  //     }
  //     traverse(columnsVal, additionCriterions, editionCriterions);

  //     // TODO: 存在多次渲染问题
  //     const openAdditionDialog = function(context:any) {
  //       const Form = context.createForm();
  //       let props = {
  //         inline: false,
  //         criterions: additionCriterions,
  //         labelWidth: "80px",
  //         onSubmit: add,
  //         closeOnClickModal: false,
  //         closeOnPressEscape: false
  //       };

  //       props = _.merge({}, props, beforeAdd(_.cloneDeep(props) || {}));
  //       context.openDialog({ title: '新增' }, Form, props);
  //       afterAdd();
  //     };
  //     const openEditionDialog = function(context:any) {
  //       const selectedRows = context.getSelectedRows();

  //       if(selectedRows.length !== 1) return;

  //       const selectedRow = selectedRows[0];

  //       for(let i = 0; i < editionCriterions.length; i++) {
  //         if(editionCriterions[i].prop) {
  //           editionCriterions[i].defaultModeValue = selectedRow[editionCriterions[i].prop] || "";
  //         }
  //       }
  //       console.log('editionCriterions', editionCriterions);
  //       let props = {
  //         inline: false,
  //         criterions: editionCriterions,
  //         labelWidth: "80px",
  //         onSubmit: edit,
  //         closeOnClickModal: false,
  //         closeOnPressEscape: false
  //       };
  //       props = _.merge({}, props, beforeEdit(_.cloneDeep(props) || {}));
  //       context.openDialog({ title: '编辑' }, Form, props);
  //       afterEdit();
  //     };
  //     const removeData = function(context:any) {
  //       const selectedRows = context.getSelectedRows();

  //       if(selectedRows.length < 1) return;

  //       beforeRemove(selectedRows);
  //       remove(selectedRows);
  //       afterRemove();
  //     };

  //     /**
  //      * generate operations buttons
  //      */
  //     const operationsVal = operations.value;
  //     const defaultOperationMap: any = {
  //       add: {
  //         label: '添加',
  //         attrs: {
  //           type: 'primary',
  //         },
  //         emit: packageContext(openAdditionDialog),
  //       },
  //       delete: {
  //         label: '删除',
  //         attrs: {
  //           type: 'danger'
  //         },
  //         emit: packageContext(removeData),
  //       },
  //       edit: {
  //         label: '编辑',
  //         emit: packageContext(openEditionDialog),
  //       }
  //     };
  //     const defaultOperationVal = defaultOperation.value;
  //     let index = 1;
  //     let mergedOperations:any = [];
  //     defaultOperationVal.split(',').forEach(key => {
  //       key = key.trim();
  //       if(!defaultOperationMap[key]) return;
  //       if(key === 'delete' && !deletable) return;
  //       if(key === 'editable' && editable) return; 

  //       mergedOperations.push({
  //         ...defaultOperationMap[key],
  //         sort: index
  //       });
  //       index++;
  //     });
      
  //     // merge custom operations
  //     if(Array.isArray(operationsVal)) {
  //       operationsVal.forEach(({ label, attrs, emit, sort }) => {
  //         if(!label) return;

  //         mergedOperations.push({
  //           label,
  //           attrs,
  //           emit: packageContext(emit),
  //           sort
  //         })
  //       })
  //     }

  //     // adjust priority
  //     mergedOperations = mergedOperations.sort(function(cur: any, next:any) {
  //       return cur.sort && next.sort && cur.sort - next.sort;
  //     });

  //     return (
  //       <div>
  //         {
  //           mergedOperations.map((operation: any) => {
  //             const { label, attrs = {}, emit } = operation;
  //             const type = attrs.type || 'default';
  //             return (<ElButton type={type} onClick={emit}>{label}</ElButton>);
  //           })
  //         }
  //       </div>
  //     )
  //   }

  //   const formatterMap = {};
  //   // TODO: 优化Promise.all
  //   for(let column of props.columns) {
  //     const { translate, prop }  = column;
  //     if(
  //       translate && 
  //       Object.prototype.toString.call(translate.remoteOptions) === '[object Promise]'
  //     ) {
  //       const {
  //         remoteOptions,
  //         key = 'label',
  //         value = 'value'
  //       } = translate;
  //       const tmpOptions = await remoteOptions;

  //       if(Array.isArray(tmpOptions)) {
  //         // TODO: 代码优化
  //         formatterMap[column.prop] = {};
  //         tmpOptions.forEach(option => {
  //           formatterMap[column.prop][option[value]] = option[key]; 
  //         })
  //       }
  //     }
  //   }

  //   const renderColumns = (columns: Columns) => {
  //     if(!Array.isArray(columns)) return

  //     const components: any = [];

  //     columns.forEach(column => {
  //       const { hidden, children, translate, ...props } = column;

  //       if(hidden) return; 

  //       let ChildrenItems = null as any;
  //       let component = null;

  //       if(Array.isArray(children) && children.length > 0) {
  //         const { label, width } = props;

  //         ChildrenItems = renderColumns(children);
  //         component = (
  //           ChildrenItems ? 
  //           <ElTableColumn label={label} width={width}>
  //             {ChildrenItems}
  //           </ElTableColumn> :
  //           <ElTableColumn label={label} width={width} />
  //         );
  //       }else {
  //         const slotFn = slots[props.prop];
  //         let formatter: any = props.formatter;

  //         if(!formatter && formatterMap[props.prop]) {

  //           formatter = (row, column, cellValue, index) => {
  //             const map = formatterMap[props.prop];
  //             return map[cellValue];
  //           };
  //         }

  //         component = (
  //           ChildrenItems ? 
  //           <ElTableColumn formatter={formatter} {...props}>
  //             {ChildrenItems}
  //           </ElTableColumn> :
  //           slotFn ? 
  //             <ElTableColumn formatter={formatter} {...props}>
  //             {{
  //               // TODO: 会造成多次渲染，存在性能问题
  //               default:(scope: any) => {
  //                 if(!scope || scope.$index && scope.$index == -1) return; 
  //                 return slotFn(scope)
  //               }
  //             }}
  //             </ElTableColumn> :
  //           <ElTableColumn formatter={formatter} {...props} />
  //         );
  //       }

  //       components.push(component)
  //     });

  //     return components;
  //   }
    
  //   const root = ref(null as any);
  //   onMounted(() => {
  //     context.clearSelection = root.value.clearSelection;
  //     context.toggleRowSelection = root.value.toggleRowSelection;
  //     context.toggleAllSelection = root.value.toggleAllSelection;
  //     context.toggleRowExpansion = root.value.toggleRowExpansion;
  //     context.setCurrentRow = root.value.setCurrentRow;
  //     context.clearSort = root.value.clearSort;
  //     context.clearFilter = root.value.clearFilter;
  //     context.doLayout = root.value.doLayout;
  //     context.sort = root.value.sort;
  //   })

  //   return {
  //     root,
  //     renderOperationButtons,
  //     renderColumns,
  //     handleSelectionChange
  //   }
  // },
  setup(props, { emit, slots }) {
    const context = {
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
    }

    let selectedRows: any = [];
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

    const editionCriterions = [];
    
    const mergeTools = (defaultTools:string, tools, options) => {
      let mergedTools = [];
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
      const additionCriterions = [];
      const traverse = function(columns, additionCriterions) {
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
      const openAdditionDialog = function(context) {
        const Form = context.createForm();
        let props = {
          inline: false,
          criterions: additionCriterions,
          labelWidth: "80px",
          onSubmit: add,
        };

        props = _.merge({}, props, beforeAdd(_.cloneDeep(props) || {}));
        context.openDialog({
          title: '新增',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }, Form, props);
        afterAdd();
      };
      const removeRows = function(context) {
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

    const generateOperationsFn = (defaultOperations: string, operations, options) => {
      let mergedOperations = [];
      const {
        columns,
        beforeEdit,
        edit,
        afterEdit,
      } = options;
      const editionCriterions = [];
      const traverse = function(columns, editionCriterions) {
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
      const openEditionDialog = function(context, props: any) {
        const { row } = props;

        for(let i = 0; i < editionCriterions.length; i++) {
          editionCriterions[i].defaultModeValue = row[editionCriterions[i].prop] || "";
        }

        const Form = context.createForm();
        let formProps = {
          inline: false,
          criterions: editionCriterions,
          labelWidth: "80px",
          onSubmit: edit,
          closeOnClickModal: false,
          closeOnPressEscape: false
        };

        formProps = _.merge({}, formProps, beforeEdit(_.cloneDeep(formProps) || {}));
        context.openDialog({ title: '编辑' }, Form, formProps);
        afterEdit();
      };
      const openQueryDialog = function(context, props: any) {};
      const operationMap = {
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
      const fn = () => {};

      traverse(columns, editionCriterions);

      let index = 1;
      defaultOperations.split(",").forEach((key: string) => {
        key = trim(key);
        if(!operationMap[key]) return;
        console.log(key, operationMap[key])
        mergedOperations.push({
          label: operationMap[key].label || '',
          attrs: operationMap[key].attrs,
          sort: index,
          emit: typeof operationMap[key].emit === 'function' ? operationMap[key].emit : fn
        });
        index++;
      });

      if(Array.isArray(operations) && operations.length > 0) {
        
        operations.forEach(operation => {
          mergedOperations.push({
            label: operation.label,
            attrs: operation.attrs || {},
            sort: operation.sort, 
            emit: typeof operation.emit === 'function' ? operation.emit : fn
          });
        });
      }

      mergedOperations = mergedOperations.sort(function(cur: any, next:any) {
        return cur.sort && next.sort && cur.sort - next.sort;
      });

      return (props: any) => mergedOperations.map(
        ({label, attrs, emit}) => (<ElButton type={attrs.type} onClick={packageContext(emit, props)}>{label}</ElButton>)
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
            const slot = {
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