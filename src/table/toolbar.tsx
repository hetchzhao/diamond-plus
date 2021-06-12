import { defineComponent } from 'vue'

import { ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-button.css';

export default defineComponent({
  name: 'toolbar',
  props: {
    tools: {
      type: Array,
      default: []
    }
  },
  components: {
    ElButton
  },
  setup(props, { emit, slots }) {
    const renderTools = (tools) => {
      if(!Array.isArray(tools)) return [];

      return tools.map(tool => 
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