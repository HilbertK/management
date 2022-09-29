<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <FlowDrawer @register="registerDetailDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="system-flow" setup>
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import FlowDrawer from './FlowDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { tipOffColumns, searchTipOffFormSchema } from './flow.data';
  import { tipOfflist } from './flow.api';
  import { FlowOpMode } from './constants';

  //注册drawer
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'tipoff-flow-list',
    tableProps: {
      title: '举报工单列表',
      rowKey: (record) => record.tipOffId,
      api: tipOfflist,
      columns: tipOffColumns,
      size: 'small',
      formConfig: {
        labelWidth: 200,
        schemas: searchTipOffFormSchema,
      },
      actionColumn: {
        width: 220,
      },
    },
  });

  //注册table数据
  const [registerTable, { reload }] = tableContext;
  /**
   * 详情
   */
  async function handleDetail(record: Recordable) {
    openDetailDrawer(true, {
      record: {
        ...record,
        id: record.relatedId,
      },
      mode: FlowOpMode.NoPermission,
      showFooter: false,
    });
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 操作栏
   */
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
</script>

<style scoped></style>
