import {
  PropType,
  defineComponent,
  inject,
  ref,
  toRefs,
  onMounted,
  toRaw,
  isRef
} from 'vue'

import _ from 'lodash';
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-table.css';
import 'element-plus/lib/theme-chalk/el-table-column.css';
import 'element-plus/lib/theme-chalk/el-button.css';

const SELECTION = 'selection'
export default defineComponent({
  name: 'dia-child-table',
  components: {
    ElTable,
    ElTableColumn
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
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
  },
  emits: ['selection-change'],
  async setup(props, { slots, emit }) {
    const { columns } =  toRefs(props);

    const root  = ref(null as any);
    onMounted(() => {});

    const renderColumns = () => {
      const recursion = (cols) => {
        if(!Array.isArray(cols)) return;

        const colComps: any = [];
        cols.forEach(col => {
          const { hidden, children, translate, ...props } = col;

          if(hidden) return;

          let colComp: any;

          if(Array.isArray(children) && children.length > 0) {
            const { label, width } = props;
            const childComps: any = recursion(children);

            colComp = (
              childComps ?
              <ElTableColumn label={label} width={width}>
                {childComps}
              </ElTableColumn> :
              <ElTableColumn label={label} width={width} />
            );
          } else {
            const slotFn = slots[props.prop];
            let formatter: any = props.formatter;

            // if(!formatter && formatterMap[props.prop]) {

            // }

            colComp = (
              slotFn ? 
              <ElTableColumn formatter={formatter} {...props}>
                {{
                  default: (scope: any) => slotFn(scope)
                }}
              </ElTableColumn> :
              <ElTableColumn formatter={formatter} {...props} />
            );
          }

          colComps.push(colComp);
        })

        return colComps;
      };

      return recursion(columns.value)
    }
  
    // await new Promise((resolve) =>{
    //   setTimeout(() =>{
    //     resolve(0)
    //   }, 2000)
    // })

    const handleSelectionChange = (val: any) => emit('selection-change', val);

    return {
      root,
      handleSelectionChange,
      renderColumns
    }
  },
  render() {
    return (
      <ElTable
        ref={(ref:any) => { this.root = ref }}
        data={this.data}
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
        {this.renderColumns()}
      </ElTable>
    );
  }
})
