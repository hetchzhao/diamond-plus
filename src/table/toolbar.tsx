import {
  defineComponent,
  PropType
} from 'vue'

import { ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-button.css';

import { Tools } from './token';

export default defineComponent({
  name: 'toolbar',
  props: {
    tools: {
      type: Array as PropType<Tools>,
      default: []
    }
  },
  components: {
    ElButton
  },
  setup(props, { emit, slots }) {
    const renderTools = (tools: Tools) => {
      if(!Array.isArray(tools)) return [];

      return tools.map(tool => 
        // @ts-ignore
        <ElButton type={tool.attrs.type} onClick={tool.emit}>
          {tool.label}
        </ElButton>
      );
    };

    return {
      renderTools
    }
  },
  render() {
    return (
      <>
        {this.renderTools(this.tools)}
      </>
    );
  }
})