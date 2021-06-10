import {
  PropType,
  defineComponent,
  toRefs,
} from 'vue'
import { ElTableColumn } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-table-column.css'

import { Columns } from './token'

export default defineComponent({
  name: 'dia-table-column',
  components: { ElTableColumn },
  props: {
    columns: {
      type: Array as PropType<Columns>,
      default: []
    }
  },
  async setup(props, { slots, emit }) {
    const { columns } = props;

    const formatterMap = {};
    for(let column of columns) {
      const { translate, prop }  = column;
      if(
        translate && 
        Object.prototype.toString.call(translate.remoteOptions) === '[object Promise]'
      ) {
        const {
          remoteOptions,
          key = 'label',
          value = 'value'
        } = translate;

        formatterMap[prop] = await remoteOptions;
        console.log('map', formatterMap);
      }
    }
  },
  render() {
    return (
      <ElTableColumn label={"aaa"} prop={"realname"} />
    );
  }
})