import DiaContainer from './container';
import DiaForm from './form';
import DiaTable from './table';
import DiaPagination from './pagination';

const version = '1.0.0';
const components = [DiaContainer, DiaForm, DiaTable, DiaPagination];
const install = (app:any, options = {}) => {
  components.forEach(component => app.component(component.name, component));
}

export default {
  version,
  install
}