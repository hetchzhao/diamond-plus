import {
  defineComponent,
  PropType,
  ref,
  watch
} from 'vue'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

import 'element-plus/lib/theme-chalk/el-checkbox-group.css';
import 'element-plus/lib/theme-chalk/el-checkbox.css';

import {
  AttributeOptions,
  ComponentSize
} from './token'

export default defineComponent({
  name: 'dia-checkbox',
  props: {
    options: {
      type: Array as PropType<AttributeOptions>,
      default: []
    },
    modelValue: [Object, Boolean, Array],
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String as PropType<ComponentSize>,
    fill: String,
    textColor: String
  },
  emits: ["update:modelValue", "change"],
  setup(props, context) {
    let val = ref(props.modelValue);

    watch(val, (newValue, oldValue) => {
      context.emit("update:modelValue", newValue)
    });

    return { val };
  },
  render() {
    return (
      <ElCheckboxGroup
        v-model={this.val}
        disabled={this.disabled}
        min={this.min}
        max={this.max}
        size={this.size}
        fill={this.fill}
        textColor={this.textColor}
      >
        {
          this.options.map(({label, value}) => <ElCheckbox label={value}>{label}</ElCheckbox>)
        }
      </ElCheckboxGroup>
    );
  }
})