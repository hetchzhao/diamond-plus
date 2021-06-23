import {
  defineComponent,
  PropType,
  reactive,
} from 'vue'
import { ElSelect, ElOption, ElTree } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-select.css';
import 'element-plus/lib/theme-chalk/el-option.css';
import 'element-plus/lib/theme-chalk/el-tree.css';

import {
  AttributeOptions,
  ComponentSize
} from './token'

export default defineComponent({
  name: 'dia-select',
  components: {
    ElSelect,
    ElOption,
    ElTree
  },
  props: {
    options: {
      type: Array as PropType<AttributeOptions>,
      default: []
    },
    remoteOptionAPI: {
      type: Promise,
      default: new Promise((resolve) => resolve([]))
    },
    modelValue: [Array, String, Number, Boolean, Object],
    autocomplete: String,
    automaticDropdown: Boolean,
    size: String as PropType<ComponentSize>,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: Number,
    placeholder: String,
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: String,
    collapseTags: Boolean,
    popperAppendToBody: Boolean,
    clearIcon: String
  },
  emit: ["update:modelValue", "change", "visible-change", "remove-tag", "clear", "blur", "focus"],
  async setup(props, context) {
    const { remoteOptionAPI } = props;
    let remoteOptions: AttributeOptions = reactive([]);
    if(Object.prototype.toString.call(remoteOptionAPI) === '[object Promise]') {
      let res:any = await remoteOptionAPI;
      if(!Array.isArray(res)) res = [];

      remoteOptions  = reactive(res);
    }
    

    const renderOptions = (options: AttributeOptions, remoteOptions: AttributeOptions) => {
      const selectedOptions = 
        Array.isArray(options) && options.length > 0 ?
        options : remoteOptions;

      return selectedOptions.map(({ label, value }) => {
        return <ElOption label={label} value={value}/>;
      })
    } 
    const handleChange = (newVal: any) => {
      context.emit("update:modelValue", newVal);
    };

    return {
      remoteOptions,
      handleChange,
      renderOptions
    };
  },
  render() {
    return (
      <ElSelect
        modelValue={this.modelValue}
        autocomplete={this.autocomplete}
        automaticDropdown={this.automaticDropdown}
        size={this.size}
        disabled={this.disabled}
        clearable={this.clearable}
        filterable={this.filterable}
        allowCreate={this.allowCreate}
        loading={this.loading}
        popperClass={this.popperClass}
        remote={this.remote}
        loadingText={this.loadingText}
        noMatchText={this.noMatchText}
        noDataText={this.noDataText}
        remoteMethod={this.remoteMethod}
        filterMethod={this.filterMethod}
        multiple={this.multiple}
        multipleLimit={this.multipleLimit}
        placeholder={this.placeholder}
        defaultFirstOption={this.defaultFirstOption}
        reserveKeyword={this.reserveKeyword}
        valueKey={this.valueKey}
        collapseTags={this.collapseTags}
        popperAppendToBody={this.popperAppendToBody}
        clearIcon={this.clearIcon}
        // @ts-ignore
        onChange={this.handleChange}
      >
        { this.renderOptions(this.options, this.remoteOptions) }
        {/* <ElOption value="">
          <ElTree 
            highlightCurrent={true}
            data={[{
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                  id: 9,
                  label: '三级 1-1-1'
                }, {
                  id: 10,
                  label: '三级 1-1-2'
                }]
              }]
            }, {
              id: 2,
              label: '一级 2',
              children: [{
                id: 5,
                label: '二级 2-1'
              }, {
                id: 6,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              children: [{
                id: 7,
                label: '二级 3-1'
              }, {
                id: 8,
                label: '二级 3-2'
              }]
            }]}
          />
        </ElOption> */}
      </ElSelect>
    );
  }
})