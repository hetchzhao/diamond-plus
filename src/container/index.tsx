import {
  defineComponent,
  onMounted,
  provide,
  reactive,
  readonly,
  toRefs,
  ref,
  watch
} from 'vue'

import { ElDialog } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-dialog.css';

import _ from 'lodash';

export default defineComponent({
  name: 'dia-container',
  components: {
    ElDialog,
  },
  setup(props, { emit }) {

    /**
     * Dialog
     */
    const defaultDialogProps = {
      modelValue: false,
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
      destroyOnClose: false,
      beforeClose: () => {},
    };
    const dialogProps = ref(_.merge({}, defaultDialogProps));
    const dialogComponent = ref(null);
    const dialogComponentProps = ref({});
    const openDialog = (props: any, component: any, componentProps: any) => {
      const newProps = _.merge({}, props);
      newProps.modelValue = true;

      dialogComponent.value = component;
      dialogComponentProps.value = componentProps;
      dialogProps.value = newProps;
    }
    const closeDialog = () => {
      const newProps = _.merge({}, defaultDialogProps);
      newProps.modelValue = false;

      dialogComponent.value = null;
      dialogComponentProps.value = {};
      dialogProps.value = newProps;
    }
    const renderDialogComponent = () => {
      if(!dialogComponent) return null;
      const Component = dialogComponent.value;
      const props = dialogComponentProps.value;

      // TODO: 保证ts校验通过
      return <Component {...props}/>;
    }

    provide('openDialog', openDialog);
    provide('closeDialog', closeDialog);

    const handleDialogClosed = () => {
      dialogComponent.value = null;
      dialogComponentProps.value = {};
    }
    return {
      dialogProps,
      renderDialogComponent,
      handleDialogClosed
    }
  },
  render() {
    return (
      <div>
        { this.$slots.default ? this.$slots.default() : null }
        {/* @ts-ignore */}
        <ElDialog
          v-model={this.dialogProps.modelValue}
          title={this.dialogProps.title}
          width={this.dialogProps.width}
          top={this.dialogProps.top}
          fullscreen={this.dialogProps.fullscreen}
          modal={this.dialogProps.modal}
          appendToBody={this.dialogProps.appendToBody}
          lockScroll={this.dialogProps.lockScroll}
          openDelay={this.dialogProps.openDelay}
          closeDelay={this.dialogProps.closeDelay}
          closeOnClickModal={this.dialogProps.closeOnClickModal}
          closeOnPressEscape={this.dialogProps.closeOnPressEscape}
          showClose={this.dialogProps.showClose}
          center={this.dialogProps.center}
          destroyOnClose={this.dialogProps.destroyOnClose}
          beforeClose={this.dialogProps.beforeClose}
          // @ts-ignore
          onClosed={this.handleDialogClosed}
        >
          { this.renderDialogComponent() }
        </ElDialog>
      </div>
    )
  }
})