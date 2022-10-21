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
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <FlowDrawer @register="registerDetailDrawer" @success="handleSuccess" />
    <FlowEvaluateDrawer @register="registerEvaluateDrawer" @success="handleSuccess" />
    <FlowEvaluateCreatorDrawer @register="registerEvaluateCreatorDrawer" @success="handleSuccess" />
    <FlowTipOffDrawer @register="registerTipOffDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="system-flow" setup>
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import FlowDrawer from './FlowDrawer.vue';
  import FlowEvaluateDrawer from './FlowEvaluateDrawer.vue';
  import FlowEvaluateCreatorDrawer from './FlowEvaluateCreatorDrawer.vue';
  import FlowTipOffDrawer from './FlowTipOffDrawer.vue';
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
  const [registerEvaluateCreatorDrawer, { openDrawer: openEvaluateCreatorDrawer }] = useDrawer();
  const [registerTipOffDrawer, { openDrawer: openTipOffDrawer }] = useDrawer();
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
        autoAdvancedCol: 5,
        autoAdvancedLine: 3,
        schemas: searchFormSchema,
        actionColOptions: { span: 3, xl: { span: 3 } },
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
   * 评价发起人
   */
  async function handleEvaluateCreator(record: Recordable) {
    openEvaluateCreatorDrawer(true, {
      record,
      showFooter: true,
    });
  }
  /**
   * 查看对发起人评价
   */
  async function showCreatorEvaluation(record: Recordable) {
    openEvaluateCreatorDrawer(true, {
      record,
      showFooter: false,
    });
  }
  /**
   * 举报
   */
  async function handleTipOff(record: Recordable) {
    openTipOffDrawer(true, {
      record,
      showFooter: true,
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
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record): ActionItem[] {
    const userStore = useUserStore();
    const userName = userStore.userInfo?.username;
    const showHandleOp = isMyHandlePage && userName === record.handleBy;
    const showCreateOp = isMyCreatePage && userName === record.createBy;
    return [
      {
        label: '接单',
        popConfirm: {
          title: '确认要接单吗？',
          confirm: handleTake.bind(null, record),
        },
        ifShow: () => isToTakePage,
      },
      {
        label: '评价处理人',
        onClick: handleEvaluate.bind(null, record),
        ifShow: () => showCreateOp && record.status === FlowStatus.Evaluate,
      },
      // 查看处理人评价
      {
        label: isMyCreatePage ? '我的评价' : '查看（评价处理人）',
        onClick: showEvaluation.bind(null, record),
        ifShow: () => !isMyHandlePage && userName !== record.handleBy && record.status === FlowStatus.End,
      },
      {
        label: '评价发起人',
        onClick: handleEvaluateCreator.bind(null, record),
        ifShow: () => showHandleOp && record.finalScoreForCreator != null && (record.status === FlowStatus.Evaluate || record.status === FlowStatus.End),
      },
      // 查看对发起人评价
      {
        label: isMyHandlePage ? '我的评价' : '查看（评价发起人）',
        onClick: showCreatorEvaluation.bind(null, record),
        ifShow: () => !isMyCreatePage && userName !== record.createBy && record.finalScoreForCreator != null && (record.status === FlowStatus.Evaluate || record.status === FlowStatus.End),
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
        label: '举报',
        onClick: handleTipOff.bind(null, record),
        ifShow: () => showCreateOp && record.status === FlowStatus.End && !record.tipOff && record.solved === false,
      },
    ];
  }
</script>

<style scoped></style>
