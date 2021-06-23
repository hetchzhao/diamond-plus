import {
  PropType,
  defineComponent,
  ref,
  onMounted,
  watch,
  reactive,
  toRaw,
  VNode,
  Suspense,
  toRefs,
  getCurrentInstance,
} from 'vue'
import {
  ElForm,
  ElFormItem,
  ElDatePicker,
  ElInput,
  ElButton,
  ElRow,
  ElCol,
} from 'element-plus'
import 'element-plus/lib/theme-chalk/el-form.css';
import 'element-plus/lib/theme-chalk/el-form-item.css';
import 'element-plus/lib/theme-chalk/el-date-picker.css';
import 'element-plus/lib/theme-chalk/el-input.css';
import 'element-plus/lib/theme-chalk/el-button.css';
import 'element-plus/lib/theme-chalk/el-row.css';
import 'element-plus/lib/theme-chalk/el-col.css';

import Checkbox from './checkbox'
import Radio from './radio'
import Select from './select'
import Cascader from './cascader'

import camelize from 'camelize';
import {
  ComponentSize,
  Criterions,
  Rules,
  Attrs,
  Events
} from './token'
import { IObjectKeys } from '../utils'
import _ from 'lodash';

const ElementMap: IObjectKeys = {
  input: {
    component: ElInput,
    modelValue: '',
  },
  datepicker: {
    component: ElDatePicker,
    modelValue: '',
  },
  checkbox: {
    component: Checkbox,
    modelValue: [],
  },
  radio: {
    component: Radio,
    modelValue: [],
  },
  select: {
    component: (props: any) => (
      <Suspense>
        {{
          default: () => <Select {...props}/>,
          fallback: () => "加载中"
        }}
      </Suspense>),
    modelValue: '',
  },
  cascader: {
    component: (props: any) => (
      <Suspense>
        {{
          default: () => <Cascader {...props}/>,
          fallback: () => "加载中"
        }}
      </Suspense>
    ),
    defaultModeValue: [],
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
  emits: ['update:criterions', 'submit'],
  setup(props, { slots, emit }) {
    const context:IObjectKeys = {
      getField: (name: string):any => {},
      setField: (name:string, value: any) => {},
      // getFieldExtraAttrs: (fieldName: string) => {},
      // setFieldExtraAttrs: (fieldName: string, attributes: IObjectKeys) => {},
      getCriterionAttrs: (fieldName: string) => {},
      setCriterionAttrs: (fieldName: string, attributes: IObjectKeys) => {},
      getFields: ():any => {},
      clearValidate: () => {},
      validate: () => {},
      validateField: () => {},
      resetFields: () => {},
    };
    const packageContext = (fn: any) => function() {
      fn(context, ...arguments);
    };

    let indexMap: IObjectKeys = {};
    let dynamicValidateForm: IObjectKeys = reactive({});
    const { criterions } = toRefs(props)
    const bindDynamicValidateForm = (criterions: Criterions) => {
      const form: IObjectKeys = {};
      const map: IObjectKeys = {};
      for(let i = 0; i < criterions.length; i++) {
        if(!criterions[i].prop || !ElementMap[criterions[i].type] || criterions[i].type === 'custom') continue;
        
        const element = ElementMap[criterions[i].type];
        // form[criterions[i].prop] = criterions[i].modelValue ? criterions[i].modelValue : element.modelValue;
        form[criterions[i].prop] = dynamicValidateForm[criterions[i].prop] || criterions[i].modelValue || element.modelValue;
        map[criterions[i].prop] = i;
      }

      indexMap = map;
      dynamicValidateForm = reactive(form);
    }
    context.setField = (name: string, value: any) => { dynamicValidateForm[name] = value; };
    context.getField = (name: string) => dynamicValidateForm[name];
    context.getFields = () => toRaw(dynamicValidateForm);
    context.getCriterionAttrs = (fieldName: string) => {
      const criterionVal = criterions.value;
      const index = indexMap[fieldName]; 
      const attrs = criterionVal[index] && criterionVal[index].attrs;

      return attrs || {}
    };
    context.setCriterionAttrs = (fieldName: string, attributes: IObjectKeys) => {
      const index = indexMap[fieldName];
      // const newCriterions = _.cloneDeep(criterions.value);
      const newCriterions = criterions.value;

      if(newCriterions[index]) {
        // newCriterions[index].attrs = _.merge(newCriterions[index].attrs, attributes);
        // emit('update:criterions', newCriterions);
        newCriterions[index].attrs = _.merge({}, newCriterions[index].attrs, attributes)
        emit('update:criterions', newCriterions);
      }
    };

    const renderFormItem = (criterions: Criterions, columns: number) => {
      const count = columns > 1 ? columns : 1;
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
          const identifier = camelize(key);
          const firstChar = identifier[0] ? identifier[0].toUpperCase() : '';
          
          if(firstChar) {
            const eventName = 'on' + firstChar + identifier.slice(1);
            map[eventName] = packageContext(events[key]);
          }
        });

        return map;
      }
      let formItems: Array<VNode> = [];

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
            attrs = {},
            events,
            isShow = true
          } = criterion;
          const slotFn = slots[prop];
          const Element = ElementMap[type].component

          if(attrs.modelValue) {
            delete attrs.modelValue
          } 

          Col = (
            <ElFormItem
              v-show={isShow}
              v-model={dynamicValidateForm[prop]}
              prop={prop}
              label={label}
              show-message={showMessage}
              inline-message={inlineMessage}
              rules={packageRules(rules as Rules)}
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
          formItems = formItems.concat(Row)
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
          if(typeof emit !== 'function') emit = () => ({});

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

    const root: any = ref(null);
    onMounted(() => {
      if(!root || !root.value) return;
      context.clearValidate = root.value.clearValidate;
      context.validate = root.value.validate;
      context.validateField = root.value.validateField;
      context.resetFields = root.value.resetFields;
    });

    bindDynamicValidateForm(criterions.value);

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