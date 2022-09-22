<template>
  <BasicDrawer @register="registerBaseDrawer" :title="getTitle" :width="adaptiveWidth" destroyOnClose>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" @click="handleSelect"> 选择用户</a-button>

        <a-dropdown v-if="checkedKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="bx:bx-unlink" />
                取消关联
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="ant-design:down-outlined" />
          </a-button>
        </a-dropdown>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <!--用户选择弹窗-->
    <UseSelectModal @register="registerModal" @select="selectOk" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import UseSelectModal from '../../role/components/UseSelectModal.vue';
  import { userList, deleteUserRole, batchDeleteUserRole, addUserRole } from '../dict.api';
  import { userColumns, searchUserFormSchema } from '../dict.data';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';

  const checkedKeys = ref<Array<string | number>>([]);
  const dictId = ref('');
  const dictTitle = ref('');
  const [registerBaseDrawer] = useDrawerInner(async (data) => {
    console.log(data);
    dictId.value = data.id;
    dictTitle.value = data.itemText;
    setProps({ searchInfo: { dictItemId: data.id } });
    reload();
  });
  //注册drawer
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setProps, clearSelectedRowKeys }] = useTable({
    title: '用户列表',
    api: userList,
    columns: userColumns,
    formConfig: {
      labelWidth: 120,
      schemas: searchUserFormSchema,
      autoSubmitOnEnter: true,
      actionColOptions: { pull: 1 },
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: true },
    canResize: false,
    rowKey: 'id',
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * 选择列配置
   */
  const rowSelection = {
    type: 'checkbox',
    columnWidth: 50,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
  };

  const getTitle = computed(() => dictTitle.value);
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteUserRole({ userId: record.id, dictItemId: dictId.value }, () => {
      reload();
      clearSelectedRowKeys();
    });
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteUserRole({ userIds: checkedKeys.value.join(','), dictItemId: dictId.value }, () => {
      reload();
      clearSelectedRowKeys();
    });
  }

  /**
   * 选择已有用户
   */
  function handleSelect() {
    openModal(true);
  }
  /**
   * 添加已有用户
   */
  async function selectOk(val) {
    await addUserRole({ dictItemId: dictId.value, userIdList: val }, reload);
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '取消关联',
        popConfirm: {
          title: '是否确认取消关联',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>
