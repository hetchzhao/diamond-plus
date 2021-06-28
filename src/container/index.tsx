import {
  defineComponent,
  provide,
  ref,
  reactive,
  h
} from 'vue'

import { ElDialog } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-dialog.css';

import _ from 'lodash';

import { IObjectKeys } from '../utils';

export default defineComponent({
  name: 'dia-container',
  components: {
    ElDialog,
  },
  setup(props, { emit }) {

    /**
     * Dialog
     */
    const dialogVisible = ref(false);
    const dialogProps: IObjectKeys = reactive({
      title: '',
      width: '50%',
      top: '15vh',
      fullscreen: false,
      modal: true,
      appendToBody: false,
      lockScroll: true,
      openDelay: 0,
      closeDelay: 0,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      showClose: true,
      center: false,
      destroyOnClose: true
    });
    let dialogChildComponent = {};
    let dialogChildComponentProps = {};
    const openDialog = (props: any, component: any, componentProps: any) => {
      dialogVisible.value = true;

      Object.keys(props).forEach(key => {
        if(typeof props[key] !== 'undefined') {
          dialogProps[key] = props[key];
        }
      });

      dialogChildComponent = component;
      dialogChildComponentProps = componentProps;
    }
    const closeDialog = () => {
      dialogVisible.value = false;
    }
    const renderDialogComponent = () => {
      return h(dialogChildComponent, dialogChildComponentProps, "");
    }

    provide('openDialog', openDialog);
    provide('closeDialog', closeDialog);

    return {
      dialogVisible,
      dialogProps,
      renderDialogComponent,
    }
  },
  render() {
    return (
      <div>
        { this.$slots.default ? this.$slots.default() : '' }
        {/* @ts-ignore */}
        <ElDialog
          v-model={this.dialogVisible}
          {...this.dialogProps}
        >
          { this.renderDialogComponent() }
        </ElDialog>
      </div>
    )
  }
})