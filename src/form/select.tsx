import {
  defineComponent,
  PropType,
  ref,
} from 'vue'
import { ElSelect, ElOption } from 'element-plus'

import 'element-plus/lib/theme-chalk/el-select.css';
import 'element-plus/lib/theme-chalk/el-option.css';

export default defineComponent({
  name: 'dia-select',
  components: {
    ElSelect,
    ElOption
  },
  props: {
    options: {
      type: Array as PropType<ComponentOptions> | undefined,
      default: undefined
    },
    remoteOptionFn: {
      type: Function,
      default: () => {}
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
  setup(props, context) {
    const optionsRef = ref(props.options);
    const remoteOptionFnRef = ref(props.remoteOptionFn);
    const renderOptions = () => {
      let options: Array<any> | undefined = optionsRef.value;
      const remoteOptionsFn = remoteOptionFnRef.value;

      if(!options) {
        if(Object.prototype.toString.call(remoteOptionsFn) === "[object Promise]") {
          remoteOptionsFn.then((res: any) => {
            optionsRef.value = Array.isArray(res) ?  res : [];
          });
        }

        options = [];
      }

      return options.map(({ label, value }) => <ElOption label={label} value={value} />);
    }

    /**
     * bind modelValue
     */
    const handleChange = (newVal: any) => {
      context.emit("update:modelValue", newVal);
    };

    return {
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
        { this.renderOptions() }
      </ElSelect>
    );
  }
})