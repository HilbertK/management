<template>
  <div>
    <div v-for="(param, index) in dynamicInput.params" :key="index" style="margin-bottom: 16px">
      <div style="display: flex; align-items: flex-start">
        <a-textarea
          placeholder="请输入内容"
          :auto-size="{ minRows: 3, maxRows: 3 }"
          allowClear
          :disabled="!param.new"
          v-model:value="param.value"
          style="margin: 0 0 5px 5px; flex-grow: 1"
          @input="emitChange"
        />
        <MinusCircleOutlined v-if="param.new && dynamicInput.params.length > min" class="dynamic-delete-button" @click="remove(param)" style="width: 50px" />
      </div>
      <div v-if="param.label" style="text-align: right">{{ param.label }}</div>
    </div>
    <div>
      <a-button :disabled="props.disabled" type="dashed" style="width: 100%" @click="add">
        <PlusOutlined />
        新增
      </a-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { defineComponent, reactive, UnwrapRef, watchEffect } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  interface Params {
    label: string;
    value: string;
    new?: boolean;
  }

  export default defineComponent({
    name: 'JAddInput',
    components: {
      MinusCircleOutlined,
      PlusOutlined,
    },
    props: {
      value: propTypes.string.def(''),
      //自定义删除按钮多少才会显示
      min: propTypes.integer.def(1),
      disabled: propTypes.bool.def(false),
      defaultLabel: propTypes.string.def(''),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      //input动态数据
      const dynamicInput: UnwrapRef<{ params: Params[] }> = reactive({ params: [] });
      //删除Input
      const remove = (item: Params) => {
        let index = dynamicInput.params.indexOf(item);
        if (index !== -1) {
          dynamicInput.params.splice(index, 1);
        }
        emitChange();
      };
      //新增Input
      const add = () => {
        dynamicInput.params.push({
          label: props.defaultLabel ?? '',
          value: '',
          new: true,
        });
        emitChange();
      };

      //监听传入数据value
      watchEffect(() => {
        initVal();
      });

      /**
       * 初始化数值
       */
      function initVal() {
        dynamicInput.params = [];
        if (props.value) {
          let jsonList = JSON.parse(props.value);
          jsonList.forEach((item) => {
            dynamicInput.params.push(item);
          });
        }
      }
      /**
       * 数值改变
       */
      function emitChange() {
        emit('change', JSON.stringify(dynamicInput.params));
        emit('update:value', JSON.stringify(dynamicInput.params));
      }

      return {
        dynamicInput,
        emitChange,
        remove,
        add,
        props,
      };
    },
  });
</script>
<style scoped>
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
  }

  .dynamic-delete-button:hover {
    color: #777;
  }

  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
