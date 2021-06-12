<template>
  <div id="app">
    <dia-container>
      <!-- <dia-form
        label-width="80px"
        defaultOperation="submit, reset"
        :criterions="criterions"
        :inline="true"
        :column="1"
        :operations="formOperations"
        @submit="submit"
        @reset="reset"
      /> -->
      <!-- <suspense> -->
      <dia-table
        height="500"
        defaultOperation="add,delete,edit"
        :defaultTools="defaultTools"
        :data="data"
        :columns="columns"
        :operations="tableOperations"
        :beforeAdd="beforeAdd"
        :afterAdd="afterAdd"
        :beforeRemove="beforeRemove"
        :remove="remove"
        :afterRemove="afterRemove"
        :add="add"
        :edit="edit"
      >
        <!-- <template v-slot:roleList="slotProps">
          <el-tag
            v-for="(role, index) in slotProps.row.roleList"
            :key="`ROLE_${index}`"
          >{{role.roleName}}</el-tag>
        </template> -->
        <template v-slot:status>
          <el-tag>临时启用</el-tag>
        </template>
        <!-- <template v-slot:operation>
          <el-button type="text">重置密码</el-button>
          <el-button type="text">配置权范围</el-button>
        </template> -->
      </dia-table>
      <!-- </suspense> -->
      <!-- <dia-pagination
        :total="1000"
        :page-sizes="[100, 200, 300, 400]"
      /> -->
    </dia-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import {
  ElButton,
  ElTag
} from 'element-plus'

const getOptionsAPI = (params: any) => new Promise((resolve) => {
  console.log('getOptions', params)
  setTimeout(() => {
    resolve(
      [{
        label: 'A租户',
        value: 'A租户'
        },{
        label: 'B租户',
        value: 'B',
      },{
        label: 'C租户',
        value: 'C'
      },{
        label: 'D租户',
        value: 'DDDD'
      }]);
  }, 2000);
});
const getStatusAPI = (params: any) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(
      [{
        key: '启用',
        val: 1
        },{
        key: '临时启用',
        val: 2,
      }]);
  }, 2000);
})

const TEST_DATA = [{
  "uuid": "d999bcac-af25-4a1c-8c25-b1a483a2af83",
  "insertTime": "2021-06-02 15:08:41.536",
  "updateTime": "2021-06-03 14:11:21.2",
  "username": "DDDD-tenant-user",
  "phone": "111111111",
  "avatar": null,
  "deptUuid": "6862854b-5d60-4bd7-94ad-a04755435984",
  "status": "1",
  "delFlag": "0",
  "realname": null,
  "tenantCode": "DDDD",
  "tenantRemark": "DDDD",
  "roleList": [{
    "uuid": "b0426b5e-a2a4-43e8-ad32-85477bca9e3d",
    "insertTime": "2021-06-02 15:15:43.343",
    "updateTime": "2021-06-02 15:15:43.343",
    "roleName": "GM0",
    "roleCode": "GM0",
    "roleDesc": "GM0",
    "tag": null,
    "tenantCode": "DDDD",
    "roleType": "1"
  }, {
    "uuid": "c30027cc-3350-4c5b-a7dd-04c243e1280b",
    "insertTime": "2021-06-02 15:08:41.503",
    "updateTime": "2021-06-02 15:08:41.503",
    "roleName": "租户admin",
    "roleCode": "TENANT_ADMIN",
    "roleDesc": null,
    "tag": null,
    "tenantCode": "DDDD",
    "roleType": "0"
  }],
  "role": null,
  "deptName": "XXX测试机构"
}, {
  "uuid": "c5448880-3b46-494f-aa53-f84efeaf7bdc",
  "insertTime": "2021-05-28 09:46:34.387",
  "updateTime": "2021-05-28 09:46:34.387",
  "username": "2级B租户-tenant-user",
  "phone": "",
  "avatar": null,
  "deptUuid": "7aa31312-5a7e-4c52-ae00-2eb264e2a998",
  "status": "2",
  "delFlag": "0",
  "realname": null,
  "tenantCode": "2级B租户",
  "tenantRemark": "2级B租户",
  "roleList": [{
    "uuid": "675ede1f-067f-4a78-8db0-7fefa594d567",
    "insertTime": "2021-05-28 09:46:34.328",
    "updateTime": "2021-05-28 09:46:34.328",
    "roleName": "租户admin",
    "roleCode": "TENANT_ADMIN",
    "roleDesc": null,
    "tag": null,
    "tenantCode": "2级B租户",
    "roleType": "0"
  }],
  "role": null,
  "deptName": "2级B租户机构"
}, {
  "uuid": "fafc462a-cb0e-466d-82e2-84691db5a5a2",
  "insertTime": "2021-05-06 09:12:35.369",
  "updateTime": "2021-05-14 14:30:53.825",
  "username": "8511707",
  "phone": "13757870465",
  "avatar": null,
  "deptUuid": "3188fede-48a7-4a9e-9f43-0de33e81e3a1",
  "status": "1",
  "delFlag": "0",
  "realname": "包成",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "44ce66b3-2266-4bbf-a462-987f06244149",
    "insertTime": "2021-04-25 09:48:20.717",
    "updateTime": "2021-04-25 09:48:20.717",
    "roleName": "通行证测试角色",
    "roleCode": "通行证测试角色",
    "roleDesc": "通行证测试角色",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }, {
    "uuid": "b74f9cde-41e4-462f-8088-d3840761cea8",
    "insertTime": "2020-09-25 14:48:23.515",
    "updateTime": "2020-09-25 14:48:23.515",
    "roleName": "test",
    "roleCode": "test",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }, {
    "uuid": "0f28be3f-d5b6-439e-87a8-2a9b110a7b6e",
    "insertTime": "2020-09-25 14:48:14.45",
    "updateTime": "2020-09-25 14:48:14.45",
    "roleName": "dev",
    "roleCode": "dev",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }],
  "role": null,
  "deptName": "A001测试机构"
}, {
  "uuid": "50d83c2e-2941-4b99-b935-bea342a6f664",
  "insertTime": "2021-04-22 16:39:46.212",
  "updateTime": "2021-04-25 09:49:50.163",
  "username": "test_oauth2_03",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "1c900bd2-6a1e-4def-9499-c43aee2e95e4",
  "status": "1",
  "delFlag": "0",
  "realname": "test_oauth2_03",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "44ce66b3-2266-4bbf-a462-987f06244149",
    "insertTime": "2021-04-25 09:48:20.717",
    "updateTime": "2021-04-25 09:48:20.717",
    "roleName": "通行证测试角色",
    "roleCode": "通行证测试角色",
    "roleDesc": "通行证测试角色",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }, {
    "uuid": "b74f9cde-41e4-462f-8088-d3840761cea8",
    "insertTime": "2020-09-25 14:48:23.515",
    "updateTime": "2020-09-25 14:48:23.515",
    "roleName": "test",
    "roleCode": "test",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }],
  "role": null,
  "deptName": "A011"
}, {
  "uuid": "752d56f1-bbae-4dce-ade9-f2570dd508e8",
  "insertTime": "2021-04-22 16:39:27.647",
  "updateTime": "2021-04-25 09:49:42.481",
  "username": "test_oauth2_02",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "1c900bd2-6a1e-4def-9499-c43aee2e95e4",
  "status": "1",
  "delFlag": "0",
  "realname": "test_oauth2_02",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "44ce66b3-2266-4bbf-a462-987f06244149",
    "insertTime": "2021-04-25 09:48:20.717",
    "updateTime": "2021-04-25 09:48:20.717",
    "roleName": "通行证测试角色",
    "roleCode": "通行证测试角色",
    "roleDesc": "通行证测试角色",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }, {
    "uuid": "b74f9cde-41e4-462f-8088-d3840761cea8",
    "insertTime": "2020-09-25 14:48:23.515",
    "updateTime": "2020-09-25 14:48:23.515",
    "roleName": "test",
    "roleCode": "test",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }],
  "role": null,
  "deptName": "A011"
}, {
  "uuid": "a782be6d-d817-4be2-95c0-7e4f4dcf31a0",
  "insertTime": "2021-04-22 16:38:59.904",
  "updateTime": "2021-04-25 09:49:38.52",
  "username": "test_oauth2_01",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "1c900bd2-6a1e-4def-9499-c43aee2e95e4",
  "status": "1",
  "delFlag": "0",
  "realname": "test_oauth2_01",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "44ce66b3-2266-4bbf-a462-987f06244149",
    "insertTime": "2021-04-25 09:48:20.717",
    "updateTime": "2021-04-25 09:48:20.717",
    "roleName": "通行证测试角色",
    "roleCode": "通行证测试角色",
    "roleDesc": "通行证测试角色",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }, {
    "uuid": "b74f9cde-41e4-462f-8088-d3840761cea8",
    "insertTime": "2020-09-25 14:48:23.515",
    "updateTime": "2020-09-25 14:48:23.515",
    "roleName": "test",
    "roleCode": "test",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }],
  "role": null,
  "deptName": "A011"
}, {
  "uuid": "629adeea-f907-4288-b90b-06ec69fd9206",
  "insertTime": "2021-03-09 15:26:45.108",
  "updateTime": "2021-03-26 14:56:09.512",
  "username": "1111",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "bdd26c00-7037-446a-896a-76879bdd4e53",
  "status": "1",
  "delFlag": "0",
  "realname": "111",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "0f28be3f-d5b6-439e-87a8-2a9b110a7b6e",
    "insertTime": "2020-09-25 14:48:14.45",
    "updateTime": "2020-09-25 14:48:14.45",
    "roleName": "dev",
    "roleCode": "dev",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }],
  "role": null,
  "deptName": "2343"
}, {
  "uuid": "f8743de5-4999-443e-a0a2-2584fca1b9fb",
  "insertTime": "2021-03-08 13:44:09.871",
  "updateTime": "2021-03-08 13:44:09.871",
  "username": "321",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "bdd26c00-7037-446a-896a-76879bdd4e53",
  "status": "2",
  "delFlag": "0",
  "realname": "321",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "b74f9cde-41e4-462f-8088-d3840761cea8",
    "insertTime": "2020-09-25 14:48:23.515",
    "updateTime": "2020-09-25 14:48:23.515",
    "roleName": "test",
    "roleCode": "test",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }],
  "role": null,
  "deptName": "2343"
}, {
  "uuid": "81b95336-26ce-40fb-b90e-1259fc87005d",
  "insertTime": "2021-01-04 13:59:33.379",
  "updateTime": "2021-01-04 13:59:43.724",
  "username": "aa23",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "39e4deab-c3c4-4698-9e5e-77b57bb7316b",
  "status": "0",
  "delFlag": "0",
  "realname": "aa23",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": [{
    "uuid": "0f28be3f-d5b6-439e-87a8-2a9b110a7b6e",
    "insertTime": "2020-09-25 14:48:14.45",
    "updateTime": "2020-09-25 14:48:14.45",
    "roleName": "dev",
    "roleCode": "dev",
    "roleDesc": "",
    "tag": null,
    "tenantCode": "A001",
    "roleType": "1"
  }, {
    "uuid": "5811be18-e5d9-430f-8a55-99f02e7710c3",
    "insertTime": "2020-09-25 14:38:02.124",
    "updateTime": "2020-09-25 14:38:02.124",
    "roleName": "租户admin",
    "roleCode": "TENANT_ADMIN",
    "roleDesc": null,
    "tag": null,
    "tenantCode": "A001",
    "roleType": "0"
  }],
  "role": null,
  "deptName": "A112"
}, {
  "uuid": "027be7bf-7d27-467e-8dc9-8561d35f7eec",
  "insertTime": "2021-01-04 13:58:29.077",
  "updateTime": "2021-03-09 14:28:22.052",
  "username": "aa1",
  "phone": "11111111111",
  "avatar": null,
  "deptUuid": "1c900bd2-6a1e-4def-9499-c43aee2e95e4",
  "status": "2",
  "delFlag": "0",
  "realname": "",
  "tenantCode": "A001",
  "tenantRemark": "A租户",
  "roleList": null,
  "role": null,
  "deptName": "A011"
}];

import HelloWorld from './components/HelloWorld';

export default defineComponent({
  name: 'app',
  components: {
    ElTag,
    ElButton,
    HelloWorld,
  },
  setup(props, { slots, emit }) {
    /**
     * Form Config
     */
    const criterions = reactive([{
      type: 'input',
      label: '用户名',
      prop: 'userName',
      attrs: {
        placeholder: '请输入用户名',
        style: 'width:200px',
      },
      // quanxian:['sys_add','sys_del']
      // showMessage: '',
      // inlineMessage: '',
      // size: '',
      // disabled: false,
      // rules: [],
      // events: []
      evnets: {
        click: (context: any) => {
          console.log('context', context);
        }
      }
    },{
      type: 'input',
      label: '真实姓名',
      prop: 'realName',
      attrs: { placeholder: '请输入真实姓名', style: 'width:200px', },
    },{
      type: 'input',
      label: '手机号',
      prop: 'mobile',
      attrs: { placeholder: '请输入手机号', style: 'width:200px', },
    },{
      type: 'select',
      label: '状态',
      prop: 'status',
      attrs: {
        style: 'width:200px',
        placeholder: '请选择状态',
        options: [{
          label: '启用',
          value: 'qiyong'
        },{
          label: '停用',
          value: 'tingyong'
        },{
          label: '临时启用',
          value: 'linghsiqiyong'
        }]
      },
    },{
      type: 'select',
      label: '租户',
      prop: 'tenement',
      attrs: {
        placeholder: '请选择租户',
        // TODO: 
        style: 'width:200px',
        remoteOptionFn: getOptionsAPI({ code: 111 })
      },
    },{
      type: 'select',
      label: '角色',
      prop: 'role',
      attrs: {
        placeholder: '请选择角色',
        style: 'width:200px',
      },
    },{
      type: 'cascader',
      label: '所属机构',
      prop: 'org',
      attrs: {
        placeholder: '请选择所属机构',
        style: 'width:200px',
        options: [{
          label: '启用',
          value: 'qiyong',
          children: [{
          label: '临时启用',
          value: 'linghsiqiyong'
        }]
        },{
          label: '停用',
          value: 'tingyong'
        },{
          label: '临时启用',
          value: 'linghsiqiyong'
        }],
      },
    }]);
    const submit = (context: any) => {
      const fields = context.getFields();
      console.log('context', context);
      // Business Logic
      // ....
    };
    const reset = (context: any) => {
      context.resetFields();
    };
    const queryDeleteUser = (context: any) => {
      // Business Logic
      // ....
    };
    const exportUserInfo = (context: any) => {
      // Business Logic
      // ....
    };
    const formOperations = [{
      label: '搜索已删除用户',
      attrs: { type: 'info'},
      emit: queryDeleteUser,
    },{
      label: '导出用户信息',
      attrs: { type: 'info' },
      emit: exportUserInfo,
    }];

    /**
     * Table Config
     */
    const columns = reactive([{
      type: 'selection',
      width: 25
    },{
      label: 'uuid',
      prop: 'uuid',
      hidden:  true,
      edition: {
        isShow: false
      }
    },{
      label: '租户',
      prop: 'tenantRemark'
    },{
      label: '租户',
      prop: 'tenantCode',
      hidden: true,
      addition: {
        type: 'select',
        attrs: {
          placeholder: '请选择租户',
          style: 'width:100%',
          remoteOptionFn: getOptionsAPI({ code: 111 })
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      edition: {
        type: 'select',
        disabled: true,
        attrs: {
          placeholder: '请选择租户',
          style: 'width:100%',
          remoteOptionFn: getOptionsAPI({ code: 111 })
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    },{
      label: '用户名',
      prop: 'username',
      addition: {
        attrs: {
          placeholder: '请输入用户名',
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      edition: {
        disabled: true,
        attrs: {
          placeholder: '请输入用户名',
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    },{
      label: '真实姓名',
      prop: 'realname',
      addition: {
        attrs: {
          placeholder: '请输入真实姓名'
        }
      },
      edition: {
        attrs: {
          placeholder: '请输入真实姓名'
        }
      }
    },{
      label: '手机号',
      prop: 'phone',
      addition: {
        attrs: {
          placeholder: '请输入手机号',
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      edition: {
        attrs: {
          placeholder: '请输入手机号',
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    },{
      label: '角色',
      prop: 'roleList'
    },{
      label: '密码',
      prop: 'password',
      hidden: true,
      addition: {
        label: '11',
        attrs: {
          placeholder: '请输入密码',
        }
      },
      edition: {
        attrs: {
          placeholder: '请输入密码',
        }
      }
    },{
      label: '所属机构',
      prop: 'deptName',
      addition: {
        type: 'select',
        attrs: {
          placeholder: '请选择机构',
          style: 'width:100%',
          remoteOptionFn: getOptionsAPI({ code: 111 })
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      edition: {
        type: 'select',
        attrs: {
          placeholder: '请选择机构',
          style: 'width:100%',
          remoteOptionFn: getOptionsAPI({ code: 111 })
        },
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    },{
      label: '创建时间',
      prop: 'insertTime'
    },{
      label: '状态',
      prop: 'status',
      // translate: {
      //   remoteOptions: getStatusAPI({ code: 111 }),
      //   key: 'key',
      //   value: 'val'
      // }
    },
    {
      label: '操作',
      prop: 'operation',
      width: 300
    }
    ]);
    const data = ref(TEST_DATA);
    const tableOperations = [{
      label: '批量导入用户',
      attrs: { type: 'info' },
      // emit: (context: any) => {
      //   console.log('批量导入用户', context);
      //   console.log('ElButton', ElButton);
      //   context.openDialog({
      //     title: '自定义'
      //   }, HelloWorld, {})
      // }
    }];
    const beforeAdd = (props: any) => {
      console.log('beforeAdd', props)
      props.labelWidth = "0px";
      // return props;
    };
    const add = (context: any) => {
      context.validate((isPress: boolean, params: Object) => {
        if(isPress) {
          const fields = context.getFields();
          console.log('add', fields);
          // Business Logic
          // ....
        }
      });
    };
    const afterAdd = (context: any) => {};
    const beforeRemove = (context: any) => {};
    const afterRemove = (context: any) => {};
    const edit = (context: any) => {
      context.validate((isPress: boolean, params: Object) => {
        if(isPress) {
          const fields = context.getFields();
          console.log('edit', fields);
          // Business Logic
          // ....
        }
      });
    };
    const remove = (rows: Array<any>) => {
      console.log('rows', rows);
      // Business Logic
      // ....
    }

    const defaultTools = ref("add, delete");
    // onMounted(() => {
    //   defaultTools.value = "add";
    //   console.log('defaultTools', defaultTools);
    // });

    return {
      defaultTools,
      criterions,
      submit,
      reset,
      formOperations,
      data,
      columns,
      tableOperations,
      beforeAdd,
      add,
      afterAdd,
      beforeRemove,
      remove,
      afterRemove,
      edit,
    };
  },
})
</script>

<style scoped>
#app {
  color: #2c3e50;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: rotate(0deg);
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
</style>