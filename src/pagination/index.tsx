import {
  defineComponent,
  inject,
  ref
} from 'vue'
import { ElPagination } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-pagination.css';

export default defineComponent({
  name: 'dia-pagination',
  components: {
    ElPagination
  },
  props: {
    small: Boolean,
    total: Number,
    pageCount: Number,
    pagerCount: {
      type: Number,
      default: 7
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40, 50, 100]
      },
    },
    popperClass: {
      type: String,
      default: 'is-mediate',
    },
    prevText: {
      type: String,
      default: '',
    },
    nextText: {
      type: String,
      default: '',
    },
    background: Boolean,
    disabled: Boolean,
    hideOnSinglePage: Boolean,
    currentPage: Number,
    pageSize: Number,
  },
  emits: [
    'size-change',
    'current-change',
    'prev-click',
    'next-click',
    'update:currentPage',
    'update:pageSize',
  ],
  setup(props, { slots, emit }) {
    
    let currentPage = null; 
    let currentChange = (val: number):void => {};
    if(props.currentPage) {
      currentPage = ref(props.currentPage);
      currentChange = (val) => {
        emit('update:currentPage', val);
      }
    }else {
      currentPage = inject('currentPage');
      // TODO: 类型修复
      currentChange = inject('updateCurrentPage');
    }

    let pageSize = null;
    let sizeChange = (val: number):void => {};
    if(props.pageSize) {
      pageSize = ref(props.pageSize);
      sizeChange = (val) => {
        emit('update:pageSize', val);
      }
    } else {
      pageSize = inject('pageSize');
      // TODO: 类型修复
      sizeChange = inject('updatePageSize');
    }

    const eventHandler = (event: any) => {
      return function() {
        emit(event, ...arguments)
      }
    }

    return {
      eventHandler,
      currentPage,
      pageSize,
      currentChange,
      sizeChange
    }
  },
  render() {

    return (
      <ElPagination
        currentPage={this.currentPage}
        pageSize={this.pageSize}
        pageSizes={this.pageSizes}
        layout={this.layout}
        total={this.total}
        small={this.small}
        pageCount={this.pageCount}
        pagerCount={this.pagerCount}
        popperClass={this.popperClass}
        prevText={this.prevText}
        nextText={this.nextText}
        background={this.background}
        disabled={this.disabled}
        hideOnSinglePage={this.hideOnSinglePage}
        // @ts-ignore
        onSizeChange={this.sizeChange}
        onCurrentChange={this.currentChange}
        onPrevClick={this.eventHandler('prev-click')}
        onNextClick={this.eventHandler('next-click')}
      />
    )
  }
})