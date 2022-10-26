<template>
  <div :class="getClass" :style="getStyle">
    <div :class="`${prefixCls}-image-wrapper`" :style="getImageWrapperStyle">
      <div :class="`${prefixCls}-image-mask`" :style="getImageWrapperStyle" @click="openModal" v-if="!disabled">
        <Icon icon="ant-design:plus-outlined" :size="16" color="#fff" />
        <div style="margin-left: 2px">{{ sourceValue ? '重新' : '' }}上传</div>
      </div>
      <img :src="sourceValue" v-if="sourceValue" alt="avatar" />
    </div>

    <CopperModal @register="register" @uploadSuccess="handleUploadSuccess" :uploadApi="uploadApi" :src="sourceValue" :bizPath="bizPath" :circled="circled" :options="getOptions" :fileSize="fileSize" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, CSSProperties, unref, ref, watchEffect, watch, PropType } from 'vue';
  import CopperModal from '../../../../Cropper/src/CopperModal.vue';
  import { Cropper } from '../../../../Cropper/src/typing';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { ButtonProps } from '/@/components/Button';
  import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
  import Icon from '/@/components/Icon';
  import { uploadImg } from '/@/api/sys/upload';

  export default defineComponent({
    name: 'JImageCropUpload',
    components: { CopperModal, Icon },
    inheritAttrs: false,
    props: {
      width: { type: [String, Number], default: '200px' },
      height: { type: [String, Number], default: '200px' },
      value: { type: String },
      showBtn: { type: Boolean, default: true },
      btnProps: { type: Object as PropType<ButtonProps> },
      btnText: { type: String, default: '' },
      bizPath: {
        type: String,
        required: false,
        default: 'temp',
      },
      circled: {
        type: Boolean,
        required: false,
        default: false,
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      fileSize: {
        type: Number,
        required: false,
        default: 1,
      },
      options: { type: Object as PropType<Cropper.Options>, default: () => ({}) },
    },
    emits: ['change', 'update:value'],
    setup(props, { emit, expose }) {
      const sourceValue = ref(props.value || '');
      const { prefixCls } = useDesign('image-crop-upload');
      const [register, { openModal, closeModal }] = useModal();
      const { createMessage } = useMessage();
      const { t } = useI18n();

      const getClass = computed(() => [prefixCls]);

      const getWidth = computed(() => `${props.width}`.replace(/px/, '') + 'px');

      const getHeight = computed(() => `${props.height}`.replace(/px/, '') + 'px');

      const getOptions = computed(() => ({ ...props.options, aspectRatio: Number(`${props.width}`.replace(/px/, '')) / Number(`${props.height}`.replace(/px/, '')) }));

      const getStyle = computed((): CSSProperties => ({ width: unref(getWidth) }));

      const getImageWrapperStyle = computed((): CSSProperties => ({ width: unref(getWidth), height: unref(getHeight) }));

      watchEffect(() => {
        sourceValue.value = props.value || '';
      });

      watch(
        () => sourceValue.value,
        (v: string) => {
          emit('update:value', v);
        },
        { immediate: true }
      );

      function handleUploadSuccess({ data }) {
        sourceValue.value = getFileAccessHttpUrl(data);
        emit('change', getFileAccessHttpUrl(data));
        createMessage.success(t('component.cropper.uploadSuccess'));
      }

      expose({ openModal: openModal.bind(null, true), closeModal });

      return {
        t,
        prefixCls,
        register,
        openModal: openModal as any,
        sourceValue,
        getClass,
        getImageWrapperStyle,
        getStyle,
        handleUploadSuccess,
        uploadApi: uploadImg as any,
        getOptions,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-image-crop-upload';

  .@{prefix-cls} {
    &-image-wrapper {
      position: relative;
    }
    &-image-mask {
      position: absolute;
      cursor: pointer;
      color: #fff;
      left: 0;
      top: 0;
      font-size: 14px;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
