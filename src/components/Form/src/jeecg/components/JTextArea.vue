<template>
  <a-textarea v-bind="attrs" v-model:value="showText" @input="backValue" placeholder="请输入内容" :auto-size="{ minRows: 3, maxRows: 3 }" allowClear style="margin: 0 0 5px 5px; flex-grow: 1" />
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'JTextArea',
    inheritAttrs: false,
    props: {
      value: propTypes.string.def(''),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const attrs = useAttrs();
      //表单值
      const showText = ref('');
      //监听value变化
      watch(
        () => props.value,
        () => {
          initVal();
        },
        { immediate: true }
      );

      /**
       * 初始化数值
       */
      function initVal() {
        if (!props.value) {
          showText.value = '';
        } else {
          let text = props.value;
          showText.value = text;
        }
      }

      /**
       * 返回值
       */
      function backValue(e) {
        let text = e?.target?.value ?? '';
        emit('change', text);
        emit('update:value', text);
      }

      return { showText, attrs, backValue };
    },
  });
</script>

<style scoped></style>
