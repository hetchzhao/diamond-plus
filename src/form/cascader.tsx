import {
  defineComponent,
  PropType,
  reactive,
  ref
} from 'vue'

import { ElCascader } from 'element-plus';
import 'element-plus/lib/theme-chalk/el-cascader.css';

import {
  CascaderOption,
  CascaderProps,
  ComponentSize
} from './token'

export default defineComponent({
  name: 'dia-cascader',
  components: { ElCascader },
  props: {
    modelValue: [Number, String, Array],
    options: {
      type: Array as PropType<CascaderOption[]>,
      default: () => ([] as CascaderOption)
    },
    props: {
      type: Object as PropType<CascaderProps>,
      default: () => ([])
    },
    size: String as PropType<ComponentSize>,
    placeholder: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: {
      type: Function,
      default: (node: any, keyword: string) => node.text.includes(keyword),
    },
    separator: {
      type: String,
      default: ' /',
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    debounce: {
      type: Number,
      default: 300,
    },
    beforeFilter: {
      type: Function,
      default: () => true,
    },
    popperClass: {
      type: String,
      default: '',
    },
    remoteOptionAPI: {
      type: Promise,
      default: new Promise((resolve) => resolve([]))
    },
  },
  emits: [
    'update:modelValue',
    'change',
    'focus',
    'blur',
    'visible-change',
    'expand-change',
    'remove-tag',
  ],
  async setup(props, context) {
    const { remoteOptionAPI } = props;
    let remoteOptions: Array<CascaderOption> = reactive([]);
    if(Object.prototype.toString.call(remoteOptionAPI) === '[object Promise]') {
      let res:any = await remoteOptionAPI;
      if(!Array.isArray(res)) res = [];

      remoteOptions  = res;
    }

    const handleChange = (newVal: any) => {
      context.emit("update:modelValue", newVal);
    }

    return {
      remoteOptions,
      handleChange
    }
  },
  render() {
    const getOptions = (modelValue: Array<CascaderOption>, remoteOptions: Array<CascaderOption>) => {
      return Array.isArray(modelValue) && modelValue.length > 0 ? modelValue : remoteOptions;
    }

    return (
      <ElCascader
        modelValue={this.modelValue}
        options={getOptions(this.options, this.remoteOptions)}
        props={this.props}
        size={this.size}
        placeholder={this.placeholder}
        disabled={this.disabled}
        clearable={this.clearable}
        filterable={this.filterable}
        filterMethod={this.filterMethod}
        separator={this.separator}
        showAllLevels={this.showAllLevels}
        collapseTags={this.collapseTags}
        debounce={this.debounce}
        beforeFilter={this.beforeFilter}
        popperClass={this.popperClass}
        // @ts-ignore
        onChange={this.handleChange}
      />
    );
  }
});