import {
  PropType,
  defineComponent,
  ref,
  onMounted,
  inject,
  // TODO: 监听criterions变化
  watch,
  toRefs,
  reactive,
  toRaw
} from 'vue'
import {
  ElForm,
  ElFormItem,
  ElDatePicker,
  ElCascader,
  ElInput,
  ElButton,
  ElRow,
  ElCol,
} from 'element-plus'
import 'element-plus/lib/theme-chalk/el-form.css';
import 'element-plus/lib/theme-chalk/el-form-item.css';
import 'element-plus/lib/theme-chalk/el-date-picker.css';
import 'element-plus/lib/theme-chalk/el-cascader.css';
import 'element-plus/lib/theme-chalk/el-input.css';
import 'element-plus/lib/theme-chalk/el-button.css';
import 'element-plus/lib/theme-chalk/el-row.css';
import 'element-plus/lib/theme-chalk/el-col.css';

import Checkbox from './checkbox'
import Radio from './radio'
import Select from './select'

import { camelize } from '../utils'

const ElementMap = {
  input: {
    component: ElInput,
    defaultModeValue: '',
  },
  cascader: {
    component: ElCascader,
    defaultModeValue: [],
  },
  datepicker: {
    component: ElDatePicker,
    defaultModeValue: '',
  },
  checkbox: {
    component: Checkbox,
    defaultModeValue: [],
  },
  radio: {
    component: Radio,
    defaultModeValue: [],
  },
  select: {
    component: Select,
    defaultModeValue: '',
  },
  custom: {
    component: null,
    defaultModeValue: null,
  }, 
};

type criterion = {
  type: string,
  prop: string,
  label?: string,
  defaultModeValue?: any,
  size?: string,
  disabled?: boolean,
  showMessage?: boolean,
  inlineMessage?: boolean,
  isShow?: boolean,
  rules?: Array<any>,
  events?: Object,
  attrs?: Object
}

export default defineComponent({
  name: 'dia-form',
  components: {
    ElForm,
    ElFormItem,
    ElDatePicker,
    ElCascader,
    ElInput,
    ElButton,
    ElRow,
    ElCol,
  },
  props: {
    criterions: {
      type: Array as PropType<Array<criterion>>,
      default: []
    },
    inline: Boolean,
    disabled: Boolean,
    labelWidth: String,
    labelPosition: String,
    size: String,
    hideRequiredAsterisk: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    inlineMessage: Boolean,
    validateOnRuleChange: Boolean,
    rules: {
      type: Object,
      default: {}
    },
    column: {
      type: Number,
      default: 1
    },
    defaultOperation: {
      type: String,
      default: 'submit,reset'
    },
    operations: {
      type: Array,
      default:[]
    }
  },
  emits: ['submit','reset'],
  setup(props, { slots, emit }) {
    const {
      criterions,
      column,
      defaultOperation,
      operations
    } = toRefs(props);
    const root: any = ref(null);
    const context = {
      setField: (name:string, value: any) => {},
      getField: (name: string):any => {},
      getFields: ():any => {},
      clearValidate: () => {},
      validate: () => {},
      validateField: () => {},
      resetFields: () => {}
    };
    const packageContext = (fn: any) => function() {
      fn(context, ...arguments);
    };
    
    let dynamicValidateForm = reactive({});
    const bindDynamicValidateForm = () => {
      const form = {};
      const criterionsVal = criterions.value;
      for(let criterion of criterionsVal) {
        if(!criterion.prop || !ElementMap[criterion.type] || criterion.type === 'custom') continue;
        const element = ElementMap[criterion.type];
        form[criterion.prop] = criterion.defaultModeValue ? criterion.defaultModeValue : element.defaultModeValue;
      }
      dynamicValidateForm = reactive(form);
    };
    context.setField = (name: string, value: any) => {
      if(dynamicValidateForm[name]) {
        dynamicValidateForm[name] = value;
      }
    }
    context.getField = (name: string) => {
      const raw = toRaw(dynamicValidateForm);
      return raw[name];
    }
    context.getFields = () => toRaw(dynamicValidateForm);
    bindDynamicValidateForm();

    onMounted(() => {
      if(!root || !root.value) return;
      context.clearValidate = root.value.clearValidate;
      context.validate = root.value.validate;
      context.validateField = root.value.validateField;
      context.resetFields = root.value.resetFields;
    }); 

    const renderFormItem = () => {
      const col = column.value;
      const criterionsVal = criterions.value;
      const count = col > 1 ? col : 1;
      const formItems = [] as any;
      let index = 0;

      const packageRules = (rules: any) => {
        if(!Array.isArray(rules)) return undefined;
        return rules.map(rule => {
          const { validator, ...rest } = rule;

          if(validator) {
            return {
              validator: packageContext(validator),
              ...rest
            };
          } else {
            return { ...rest };
          }
        }); 
      };
      const packageEvents = (events: any) => {
        if(!events) events = {};
        const map = {};
        
        Object.keys(events).forEach(key => {
          const eventName = 'on' + camelize(key);
          map[eventName] = packageContext(events[key]);
        });

        return map;
      };

      while(index < criterionsVal.length) {
        const partCriterions = criterionsVal.slice(index, count + index);
        let components: any = [];

        partCriterions.forEach(criterion => {
          const {
            type,
            prop,
            label,
            showMessage,
            inlineMessage,
            size,
            disabled,
            rules,
            attrs,
            events,
            isShow = true
          } = criterion;
          const slotFn = slots[prop];
          const Element = ElementMap[type].component;

          let component = (
            <ElFormItem
              v-model={dynamicValidateForm[prop]}
              prop={prop}
              label={label}
              show-message={showMessage}
              inline-message={inlineMessage}
              rules={packageRules(rules)}
              v-show={isShow}
            >
              {
                Element === null ? 
                  slotFn ? slotFn(context) : null :
                  <Element
                    v-model={dynamicValidateForm[prop]}
                    size={size}
                    disabled={disabled}
                    {...attrs}
                    {...packageEvents(events)}
                  />
              }
            </ElFormItem>
          );

          if(count > 1){
            const span = Math.floor(24 / count);
            component = (
              <ElCol span={span}>
                { component }
              </ElCol>
            );
          }

          components.push(component);

          index++;
        });

        if(count > 1) {
          components = (
            <ElRow>
              { components }
            </ElRow>
          );
        }

        formItems.push(components)
      }

      return formItems;
    }

    const renderFormOperations = () => {
      const defaultOperationVal = defaultOperation.value;
      const operationsVal = operations.value;

      const submit = (context: any) => {
        emit('submit', context);
      };
      const reset = (context: any) => {
        emit('reset', context);
      };
      const defaultOperationMap: any = {
        submit: {
          label: '提交',
          attrs: {
            type: 'primary'
          },
          emit: packageContext(submit),
        },
        reset: {
          label: '重置',
          emit: packageContext(reset),
        }
      };

      let index = 1;
      let mergedOperations: any = [];
      defaultOperationVal.split(',').forEach(key => {
        key = key.trim();
        if(!defaultOperationMap[key]) return;

        mergedOperations.push({
          ...defaultOperationMap[key],
          sort: index
        });
        index++;
      });

      if(Array.isArray(operationsVal)) {
        operationsVal.forEach(({ label, attrs, emit, sort }) => {
          if(!label) return;
          if(typeof emit !== 'function') emit = () => {};

          mergedOperations.push({
            label,
            attrs,
            emit: packageContext(emit),
            sort
          })
        })
      }

      mergedOperations = mergedOperations.sort(function(cur: any, next:any) {
        return cur.sort && next.sort && cur.sort - next.sort;
      });

      return (
        <ElFormItem>
          {
            mergedOperations.map((operation: any) => { 
              const { label, attrs = {}, emit } = operation;
              const type = attrs.type || 'default';
              return (<ElButton type={type} onClick={emit}>{label}</ElButton>);
            })
          }
        </ElFormItem>
      );
    };

    return {
      root,
      dynamicValidateForm,
      renderFormItem,
      renderFormOperations
    }
  },
  render() {
    return (
      <ElForm
        ref={(ref: any) => this.root = ref}
        model={this.dynamicValidateForm}
        inline={this.inline}
        label-position={this.labelPosition}
        label-width={this.labelWidth}
        size={this.size}
        disabled={this.disabled}
        hide-required-asterisk={this.hideRequiredAsterisk}
        show-message={this.showMessage}
        inline-message={this.inlineMessage}
        validate-on-rule-change={this.validateOnRuleChange}
        rules={this.rules}
      >
        { this.renderFormItem() }
        { this.renderFormOperations() }
      </ElForm>
    );
  }
});