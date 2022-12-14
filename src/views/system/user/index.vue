<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"> 新增</a-button>
        <a-button type="primary" :preIcon="getExportIcon" @click="onExportXlsHandler" :loading="loadingRef">{{ getExportText }}</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
        <a-button type="primary" @click="handleSyncUser" preIcon="ant-design:sync-outlined"> 同步律谷数据</a-button>
        <!-- <a-button type="primary" @click="openModal(true, {})" preIcon="ant-design:hdd-outlined"> 回收站</a-button> -->
        <!-- <JThirdAppButton biz-type="user" :selected-row-keys="selectedRowKeys" syncToApp syncToLocal @sync-finally="onSyncFinally" /> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
              <a-menu-item key="2" @click="batchFrozen(2)">
                <Icon icon="ant-design:lock-outlined"></Icon>
                冻结
              </a-menu-item>
              <a-menu-item key="3" @click="batchFrozen(1)">
                <Icon icon="ant-design:unlock-outlined"></Icon>
                解冻
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
    <!--修改密码-->
    <PasswordModal @register="registerPasswordModal" @success="reload" />
    <!--用户代理-->
    <!-- <UserAgentModal @register="registerAgentModal" @success="reload" /> -->
    <!--回收站-->
    <!-- <UserRecycleBinModal @register="registerModal" @success="reload" /> -->
  </div>
</template>

<script lang="ts" name="system-user" setup>
  //ts语法
  import { ref, computed, unref } from 'vue';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import UserDrawer from './UserDrawer.vue';
  // import UserRecycleBinModal from './UserRecycleBinModal.vue';
  import PasswordModal from './PasswordModal.vue';
  // import UserAgentModal from './UserAgentModal.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './user.data';
  import { list, deleteUser, batchDeleteUser, getImportUrl, getExportUrl, frozenBatch, syncUser } from './user.api';

  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();

  const loadingRef = ref<Nullable<boolean>>(false);

  const getExportText = computed(() => (loadingRef.value ? '导出中' : '导出'));
  const getExportIcon = computed(() => (!loadingRef.value ? 'ant-design:export-outlined' : ''));
  //回收站model
  // const [registerModal, { openModal }] = useModal();
  //密码model
  const [registerPasswordModal, { openModal: openPasswordModal }] = useModal();
  //代理人model
  // const [registerAgentModal, { openModal: openAgentModal }] = useModal();

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'user-list',
    tableProps: {
      title: '用户列表',
      api: list,
      columns: columns,
      size: 'small',
      formConfig: {
        labelWidth: 50,
        autoAdvancedCol: 4,
        autoAdvancedLine: 3,
        schemas: searchFormSchema,
        actionColOptions: { span: 4, xl: { span: 5 } },
      },
      actionColumn: {
        width: 220,
      },
      beforeFetch: (params) => {
        return Object.assign({ column: 'createTime', order: 'desc' }, params);
      },
    },
    exportConfig: {
      name: '用户列表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
    },
  });

  async function onExportXlsHandler() {
    loadingRef.value = true;
    await onExportXls();
    loadingRef.value = false;
  }

  //注册table数据
  const [registerTable, { reload, updateTableDataRecord }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增事件
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  async function handleDetail(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteUser({ id: record.id }, reload);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteUser({ ids: selectedRowKeys.value }, () => {
      selectedRowKeys.value = [];
      reload();
    });
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 打开修改密码弹窗
   */
  function handleChangePassword(username) {
    openPasswordModal(true, { username });
  }
  /**
   * 打开代理人弹窗
   */
  // function handleAgentSettings(userName) {
  //   openAgentModal(true, { userName });
  // }
  /**
   * 冻结解冻
   */
  async function handleFrozen(record, status) {
    await frozenBatch({ ids: record.id, status: status }, reload);
  }
  /**
   * 批量冻结解冻
   */
  function batchFrozen(status) {
    createConfirm({
      iconType: 'warning',
      title: '确认操作',
      content: '是否' + (status == 1 ? '解冻' : '冻结') + '选中账号?',
      onOk: async () => {
        await frozenBatch({ ids: unref(selectedRowKeys).join(','), status: status }, reload);
      },
    });
  }
  /**
   *同步流程
   */
  function handleSyncUser() {
    syncUser();
    reload();
  }

  /**
   * 操作栏
   */
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        // ifShow: () => hasPermission('system:user:edit'),
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record): ActionItem[] {
    return [
      {
        label: '冻结',
        ifShow: record.status == 1,
        popConfirm: {
          title: '确定冻结吗?',
          confirm: handleFrozen.bind(null, record, 2),
        },
      },
      {
        label: '解冻',
        ifShow: record.status == 2,
        popConfirm: {
          title: '确定解冻吗?',
          confirm: handleFrozen.bind(null, record, 1),
        },
      },
      {
        label: '密码',
        onClick: handleChangePassword.bind(null, record.username),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
      // {
      //   label: '代理人',
      //   onClick: handleAgentSettings.bind(null, record.username),
      // },
    ];
  }
</script>

<style scoped></style>
