<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate" v-if="isMyCreatePage"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <FlowDrawer @register="registerDetailDrawer" @success="handleSuccess" />
    <FlowEvaluateDrawer @register="registerEvaluateDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="system-flow" setup>
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import FlowDrawer from './FlowDrawer.vue';
  import FlowEvaluateDrawer from './FlowEvaluateDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useUserStore } from '/@/store/modules/user';
  import { useRouter } from 'vue-router';
  import { columns, searchFormSchema } from './flow.data';
  import { list, createlist, handlingList, takeList, getImportUrl, getExportUrl, invalidateFlow, solveFlow, takeFlow } from './flow.api';
  import { flowFinishedStatusList, FlowOpMode, FlowStatus } from './constants';
  import { unref } from 'vue';

  //注册drawer
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();
  const [registerEvaluateDrawer, { openDrawer: openEvaluateDrawer }] = useDrawer();
  const { currentRoute } = useRouter();
  const { query } = unref(currentRoute);
  const isMyHandlePage = !!query.handle;
  const isMyCreatePage = !!query.create;
  const isToTakePage = !!query.take;

  // 列表页面公共参数、方法
  const { tableContext, onExportXls } = useListPage({
    designScope: 'flow-list',
    tableProps: {
      title: '工单列表',
      api: isMyCreatePage ? createlist : isMyHandlePage ? handlingList : isToTakePage ? takeList : list,
      columns: columns,
      size: 'small',
      formConfig: {
        labelWidth: 200,
        schemas: searchFormSchema,
      },
      actionColumn: {
        width: 220,
      },
      beforeFetch: (params) => {
        return Object.assign({ column: 'createTime', order: 'desc' }, params);
      },
    },
    exportConfig: {
      name: '工单列表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
    },
  });

  //注册table数据
  const [registerTable, { reload }] = tableContext;

  /**
   * 新增事件
   */
  function handleCreate() {
    openDetailDrawer(true, {
      mode: FlowOpMode.Add,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openDetailDrawer(true, {
      record,
      mode: FlowOpMode.Edit,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleReassign(record: Recordable) {
    openDetailDrawer(true, {
      record,
      mode: FlowOpMode.Reassign,
      showFooter: true,
    });
  }
  /**
   * 评价
   */
  async function handleEvaluate(record: Recordable) {
    openEvaluateDrawer(true, {
      record,
      showFooter: true,
    });
  }
  /**
   * 查看评价
   */
  async function showEvaluation(record: Recordable) {
    openEvaluateDrawer(true, {
      record,
      showFooter: false,
    });
  }
  /**
   * 详情
   */
  async function handleDetail(record: Recordable) {
    openDetailDrawer(true, {
      record,
      mode: FlowOpMode.NoPermission,
      showFooter: false,
    });
  }
  /**
   * 解决工单
   */
  async function handleSolve(record) {
    await solveFlow(record.id, handleSuccess);
  }
  /**
   * 接单
   */
  async function handleTake(record) {
    await takeFlow(record.id, handleSuccess);
  }
  /**
   * 撤销事件
   */
  async function handleInvalidate(record) {
    await invalidateFlow(record.id, handleSuccess);
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
    const userStore = useUserStore();
    const userName = userStore.userInfo?.username;
    const showHandleOp = isMyHandlePage && userName === record.handleBy;
    const showCreateOp = isMyCreatePage && userName === record.createBy;
    return [
      {
        label: '转交',
        onClick: handleReassign.bind(null, record),
        ifShow: () => showHandleOp && record.status === FlowStatus.Handle,
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        ifShow: () => showCreateOp && !flowFinishedStatusList.includes(record.status),
      },
      {
        label: '评价',
        onClick: handleEvaluate.bind(null, record),
        ifShow: () => showCreateOp && record.status === FlowStatus.Evaluate,
      },
      {
        label: '查看评价',
        onClick: showEvaluation.bind(null, record),
        ifShow: () => !isMyHandlePage && userName !== record.handleBy && record.status === FlowStatus.End,
      },
      {
        label: '解决',
        popConfirm: {
          title: '是否确认解决？',
          confirm: handleSolve.bind(null, record),
        },
        ifShow: () => showHandleOp && record.status === FlowStatus.Handle,
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '撤销',
        popConfirm: {
          title: '是否确认撤销？',
          confirm: handleInvalidate.bind(null, record),
        },
        ifShow: () => showCreateOp && !flowFinishedStatusList.includes(record.status),
      },
      {
        label: '接单',
        popConfirm: {
          title: '确认要接单吗？',
          confirm: handleTake.bind(null, record),
        },
        ifShow: () => isToTakePage,
      },
    ];
  }
</script>

<style scoped></style>
