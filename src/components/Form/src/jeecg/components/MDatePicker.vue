<template>
  <div>
    <a-input readonly :value="dateStr" @click="select" v-bind="attrs" />
    <van-popup :show="show" round position="bottom" @close="close">
      <van-datetime-picker v-model="currentDate" type="datetime" title="选择时间" :min-date="props.minDate" :max-date="props.maxDate" @confirm="confirm" @cancel="close" />
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect, computed } from 'vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import moment from 'moment';
  import { formatToDateTime } from '/@/utils/dateUtil';

  export default defineComponent({
    name: 'MDatePicker',
    props: {
      minDate: null,
      maxDate: null,
      value: null,
    },
    emits: ['options-change', 'change', 'update:value'],
    setup(props, { emit }) {
      let currentDate = ref(new Date());
      const attrs = useAttrs();
      const show = ref(false);
      const select = () => {
        show.value = true;
      };
      const close = () => {
        show.value = false;
      };
      const confirm = (value: any) => {
        currentDate.value = value;
        emitChange();
        close();
      };
      //监听传入数据value
      watchEffect(() => {
        initVal();
      });

      /**
       * 初始化数值
       */
      function initVal() {
        currentDate.value = new Date();
        if (props.value) {
          currentDate.value = moment(props.value).toDate();
        }
      }
      /**
       * 数值改变
       */
      function emitChange() {
        emit('change', formatToDateTime(moment(currentDate.value)));
        emit('update:value', formatToDateTime(moment(currentDate.value)));
      }
      const dateStr = computed(() => (props.value ? formatToDateTime(props.value) : ''));
      return {
        show,
        select,
        close,
        confirm,
        attrs,
        currentDate,
        dateStr,
        props,
      };
    },
  });
</script>
