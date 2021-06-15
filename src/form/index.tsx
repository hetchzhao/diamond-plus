import {
  PropType,
  defineComponent,
  ref,
  onMounted,
  watch,
  reactive,
  toRaw,
  VNode
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
import {
  ComponentSize,
  Criterions,
  Rules,
  Attrs,
  Events
} from './token'
import { IObjectKeys } from '../utils'

const ElementMap: IObjectKeys = {
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

interface Operation extends IObjectKeys {
  label?: string,
  attrs?: Attrs,
  emit?: () => {},
  sort?: number
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
      type: Array as PropType<Criterions>,
      default: []
    },
    inline: Boolean,
    disabled: Boolean,
    labelWidth: String,
    labelPosition: String,
    size: String as PropType<ComponentSize>,
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
      type: Array as PropType<Array<Operation>>,
      default:[]
    }
  },
  emits: ['submit','reset'],
  setup(props, { slots, emit }) {
    const context:IObjectKeys = {
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

    let dynamicValidateForm: IObjectKeys = reactive({});
    const bindDynamicValidateForm = (criterions: Criterions) => {
      const form: IObjectKeys = {};
      for(let criterion of criterions) {
        if(!criterion.prop || !ElementMap[criterion.type] || criterion.type === 'custom') continue;
        
        const element = ElementMap[criterion.type];
        form[criterion.prop] = criterion.defaultModeValue ? criterion.defaultModeValue : element.defaultModeValue;
      }

      dynamicValidateForm = reactive(form);
    }
    context.setField = (name: string, value: any) => {};
    context.getField = (name: string) => {};
    context.getFields = () => toRaw(dynamicValidateForm);

    const renderFormItem = (criterions: Criterions, columns: number) => {
      const count = columns > 1 ? columns : 1;
      const formItems: Array<VNode> = [];
      const packageRules = (rules: Rules) => {
        if(!Array.isArray(rules)) return undefined;

        return rules.map(rule => {
          const { validator, ...rest } = rule;

          return validator ? 
            { validator: packageContext(validator), ...rest } : 
            { ...rest }
        })
      }
      const packageEvents = (events: Events) => {
        if(!events) events = {};

        const map: IObjectKeys = {};

        Object.keys(events).forEach(key => {
          const eventName = 'on' + camelize(key);
          map[eventName] = packageContext(events[key]);
        });

        return map;
      }

      let index = 0;
      while(index < criterions.length) {
        const someCriterions = criterions.slice(index, count + index);
        let Row: VNode | Array<VNode>;
        let Col: VNode;
        let Cols: Array<VNode> = [];

        someCriterions.forEach(criterion => {
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
          const Element = ElementMap[type].component

          Col = (
            <ElFormItem
              v-model={dynamicValidateForm[prop]}
              prop={prop}
              label={label}
              show-message={showMessage}
              inline-message={inlineMessage}
              rules={packageRules(rules as Rules)}
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
                    {...packageEvents(events as Events)}
                  />
              }
            </ElFormItem>
          );

          if (count > 1) {
            const span = Math.floor(24 / count);
            Col = (
              <ElCol span={span}>
                { Col }
              </ElCol>
            );
          }

          Cols.push(Col);

          index++;
        });

        Row = count > 1 ? 
          (<ElRow>{ Cols }</ElRow>) :
          Cols;

        if(Array.isArray(Row)) {
          formItems.splice(formItems.length-1, 0, ...Row)
        }else {
          formItems.push(Row);
        }
        
      }

      return formItems
    }

    const renderFormOperations = (defaultOperation: string, operations: Array<Operation>) => {
      const submit = (context: IObjectKeys) => {
        emit('submit', context);
      };
      const reset = (context: IObjectKeys) => {
        context.resetFields();
      };
      
      const defaultOperationMap:IObjectKeys = {
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
      let mergedOperations: Array<any> = [];
      
      let index = 1;
      defaultOperation.split(',').forEach(key => {
        key = key.trim();

        if(!defaultOperationMap[key]) return;

        mergedOperations.push({
          label: defaultOperationMap[key].label,
          attrs: defaultOperationMap[key].attrs,
          emit: defaultOperationMap[key].emit,
          sort: index
        });
        index++;
      });

      if(Array.isArray(operations)) {
        operations.forEach(({ label, attrs, emit, sort }) => {
          if(!label) return;
          if(typeof emit !== 'function') emit = () => {};

          mergedOperations.push({
            label: label,
            attrs: attrs ? attrs : {},
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
            mergedOperations.map((operation: Operation) => { 
              const { label, attrs = {}, emit } = operation;
              const type = attrs.type || 'default';
              return (
                // @ts-ignore
                <ElButton type={type} onClick={emit}>{label}</ElButton>
              );
            })
          }
        </ElFormItem>
      );
    };


    const { criterions } = props
    bindDynamicValidateForm(criterions);

    const root: any = ref(null);
    onMounted(() => {
      if(!root || !root.value) return;
      context.clearValidate = root.value.clearValidate;
      context.validate = root.value.validate;
      context.validateField = root.value.validateField;
      context.resetFields = root.value.resetFields;
    });

    watch(() => props.criterions, (newVal) => {
      bindDynamicValidateForm(newVal);
    },{ deep: true });

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
        { this.renderFormItem(this.criterions, this.column) }
        { this.renderFormOperations(this.defaultOperation, this.operations) }
      </ElForm>
    );
  }
});