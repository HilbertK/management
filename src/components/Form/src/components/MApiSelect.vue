<template>
  <div>
    <a-input v-bind="attrs" readonly :value="currentValue" @click="select" />
    <van-popup :show="show" round position="bottom" @close="close">
      <van-picker
        :default-index="getOptions.findIndex((item) => item.label === currentValue)"
        title="请选择"
        :columns="getOptions.map((item) => item.label)"
        @cancel="close"
        @confirm="handleConfirm"
      />
    </van-popup>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, computed, unref, watch } from 'vue';
  import { isFunction } from '/@/utils/is';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { get, omit } from 'lodash-es';
  import { propTypes } from '/@/utils/propTypes';

  type OptionsItem = { label: string; value: string; disabled?: boolean };

  export default defineComponent({
    name: 'MApiSelect',
    inheritAttrs: false,
    props: {
      value: String,
      numberToString: propTypes.bool,
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
        default: null,
      },
      // api params
      params: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      // support xxx.xxx.xx
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('label'),
      valueField: propTypes.string.def('value'),
      immediate: propTypes.bool.def(true),
    },
    emits: ['options-change', 'change'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([]);
      const loading = ref(false);
      const isFirstLoad = ref(true);
      const attrs = useAttrs();

      const show = ref(false);
      const select = async () => {
        if (!props.immediate && unref(isFirstLoad)) {
          await fetch();
          isFirstLoad.value = false;
        }
        show.value = true;
      };
      const close = () => {
        show.value = false;
      };

      const getOptions = computed(() => {
        const { labelField, valueField, numberToString } = props;
        return unref(options).reduce((prev, next: Recordable) => {
          if (next) {
            const value = next[valueField];
            prev.push({
              ...omit(next, [labelField, valueField]),
              label: next[labelField],
              value: numberToString ? `${value}` : value,
            });
          }
          return prev;
        }, [] as OptionsItem[]);
      });

      watchEffect(() => {
        props.immediate && fetch();
      });

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoad) && fetch();
        },
        { deep: true }
      );

      async function fetch() {
        const api = props.api;
        if (!api || !isFunction(api)) return;
        options.value = [];
        try {
          loading.value = true;
          const res = await api(props.params);
          if (Array.isArray(res)) {
            options.value = res;
          } else if (props.resultField) {
            options.value = get(res, props.resultField) || [];
          }
          emitChange();
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      function emitChange() {
        emit('options-change', unref(getOptions));
      }

      function handleConfirm(value: string) {
        const item = getOptions.value.find((item) => item.label === value);
        emit('change', item?.value, item);
        close();
      }

      const currentValue = computed(() => {
        const item = getOptions.value.find((item) => item.value === props.value);
        return item?.label ?? '';
      });

      return {
        currentValue,
        attrs,
        getOptions,
        loading,
        show,
        handleConfirm,
        select,
        close,
        confirm,
      };
    },
  });
</script>
