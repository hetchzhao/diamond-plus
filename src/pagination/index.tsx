import { defineComponent } from 'vue'
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
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
  },
  emits: [
    'size-change',
    'current-change',
    'prev-click',
    'next-click',
  ],
  setup(props, { slots, emit }) {
    let currentPage = props.currentPage;
    let pageSize = props.pageSize;

    const handleCurrentChange = (page: number) => {
      currentPage = page;

      emit('current-change', {
        current: currentPage,
        size: pageSize
      });
    }
    const handlePrevClick = (page: number) => {
      currentPage = page;

      emit('prev-click', {
        current: currentPage,
        size: pageSize
      });
    };
    const handleNextClick = (page: number) => {
      currentPage = page;

      emit('next-click', {
        current: currentPage,
        size: pageSize
      });
    }

    const handleSizeChange = (size: number) => {
      pageSize = size;

      emit('size-change', {
        current: currentPage,
        size: pageSize
      });
    };

    return {
      handleCurrentChange,
      handleSizeChange,
      handlePrevClick,
      handleNextClick,
    }
  },
  render() {

    return (
      <ElPagination
        currentPage={this.currentPage}
        small={ this.small }
        total={ this.total }
        pageCount={ this.pageCount }
        pagerCount={ this.pagerCount }
        layout={ this.layout }
        pageSizes={ this.pageSizes }
        popperClass={ this.popperClass }
        prevText={ this.prevText }
        nextText={ this.nextText }
        background={ this.background }
        disabled={ this.disabled }
        hideOnSinglePage={ this.hideOnSinglePage }
        pageSize={ this.pageSize }
        // @ts-ignore
        onSizeChange={this.handleSizeChange}
        onCurrentChange={this.handleCurrentChange}
        onPrevClick={this.handlePrevClick}
        onNextClick={this.handleNextClick}
      />
    )
  }
})