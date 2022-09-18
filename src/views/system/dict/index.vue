<template>
  <!--引用表格-->
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"> 新增</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="batchHandleDelete">
              <Icon icon="ant-design:delete-outlined" />
              删除
            </a-menu-item>
          </a-menu>
        </template>
        <a-button
          >批量操作
          <Icon icon="ant-design:down-outlined" />
        </a-button>
      </a-dropdown>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <!--字典弹窗-->
  <DictItemModal @register="registerModal" @success="reload" :dictId="currDictId" />
  <!--字典配置抽屉-->
  <!-- <DictItemList @register="registerDrawer" /> -->
  <DictUserTable @register="roleUserDrawer" />
  <!--回收站弹窗-->
  <!-- <DictRecycleBinModal @register="registerModal1" @success="reload" /> -->
</template>

<script lang="ts" name="system-dict" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import DictUserTable from './components/DictUserTable.vue';
  import DictItemModal from './components/DictItemModal.vue';
  import { dictItemColumns, dictItemSearchFormSchema, currDictId } from './dict.data';
  import { problemDictItemList, deleteDictItem, batchDeleteDictItem } from './dict.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  //字典model
  const [registerModal, { openModal }] = useModal();
  //字典配置drawer
  // const [registerDrawer, { openDrawer }] = useDrawer();
  const [roleUserDrawer, { openDrawer: openDictUserDrawer }] = useDrawer();

  //回收站model
  // const [registerModal1, { openModal: openRecycleModal }] = useModal();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'dict-item-template',
    tableProps: {
      title: '工单分类',
      api: problemDictItemList,
      columns: dictItemColumns,
      formConfig: {
        schemas: dictItemSearchFormSchema,
      },
      actionColumn: {
        width: 240,
      },
    },
  });

  //注册table数据
  const [registerTable, { reload, updateTableDataRecord, clearSelectedRowKeys }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增事件
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteDictItem({ id: record.id }, () => {
      reload();
      clearSelectedRowKeys();
    });
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteDictItem({ ids: selectedRowKeys.value }, () => {
      reload();
      clearSelectedRowKeys();
    });
  }
  /**
   * 成功回调
   */
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
  /**
   * 字典配置
   */
  function handleItem(record) {
    openDictUserDrawer(true, record);
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '分类配置',
        onClick: handleItem.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '确定删除吗?',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>

<style scoped></style>
