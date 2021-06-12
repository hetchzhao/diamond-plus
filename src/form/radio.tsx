import {
  defineComponent,
  PropType,
  ref,
  watch
} from 'vue'
import { ElRadio, ElRadioGroup } from 'element-plus'

export default defineComponent({
  name: 'dia-radio',
  props: {
    options: {
      type: Array as PropType<ComponentOptions>,
      default: []
    },
    modelValue: [String, Number, Boolean],
    size: String as PropType<ComponentSize>,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  emits: ["update:modelValue", "change"],
  setup(props, context) {
    let val = ref(props.modelValue);

    watch(val, (newValue, oldValue) => {
      context.emit("update:modelValue", newValue);
    });

    return { val }
  },
  render() {
    return (
      <ElRadioGroup
      v-model={this.val}
      size={this.size}
      fill={this.fill}
      textColor={this.textColor}
      disabled={this.disabled}
    >
      {
        this.options.map(({label, value}) => <ElRadio label={value}>{label}</ElRadio>)
      }
    </ElRadioGroup>
    );
  }
})