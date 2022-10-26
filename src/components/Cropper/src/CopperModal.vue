<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="t('component.cropper.modalTitle')"
    :okButtonProps="{ disabled: !src }"
    width="800px"
    :canFullscreen="false"
    @ok="handleOk"
    :okText="t('component.cropper.okText')"
  >
    <div :class="prefixCls">
      <div :class="`${prefixCls}-left`">
        <div :class="`${prefixCls}-cropper`">
          <CropperImage v-if="src" :src="src" height="300px" :circled="circled" @cropend="handleCropend" @ready="handleReady" :options="options" />
        </div>

        <div :class="`${prefixCls}-toolbar`">
          <Upload :fileList="[]" accept="image/*" :beforeUpload="handleBeforeUpload">
            <Tooltip :title="t('component.cropper.selectImage')" placement="bottom">
              <a-button size="small" preIcon="ant-design:upload-outlined" type="primary" />
            </Tooltip>
          </Upload>
          <Space>
            <Tooltip :title="t('component.cropper.btn_reset')" placement="bottom">
              <a-button type="primary" preIcon="ant-design:reload-outlined" size="small" :disabled="!src" @click="handlerToolbar('reset')" />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_rotate_left')" placement="bottom">
              <a-button type="primary" preIcon="ant-design:rotate-left-outlined" size="small" :disabled="!src" @click="handlerToolbar('rotate', -45)" />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_rotate_right')" placement="bottom">
              <a-button type="primary" preIcon="ant-design:rotate-right-outlined" size="small" :disabled="!src" @click="handlerToolbar('rotate', 45)" />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_scale_x')" placement="bottom">
              <a-button type="primary" preIcon="vaadin:arrows-long-h" size="small" :disabled="!src" @click="handlerToolbar('scaleX')" />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_scale_y')" placement="bottom">
              <a-button type="primary" preIcon="vaadin:arrows-long-v" size="small" :disabled="!src" @click="handlerToolbar('scaleY')" />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_zoom_in')" placement="bottom">
              <a-button type="primary" preIcon="ant-design:zoom-in-outlined" size="small" :disabled="!src" @click="handlerToolbar('zoom', 0.1)" />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_zoom_out')" placement="bottom">
              <a-button type="primary" preIcon="ant-design:zoom-out-outlined" size="small" :disabled="!src" @click="handlerToolbar('zoom', -0.1)" />
            </Tooltip>
          </Space>
        </div>
      </div>
      <div :class="`${prefixCls}-right`">
        <div :class="`${prefixCls}-preview`" v-if="previewSource">
          <img :src="previewSource" :alt="t('component.cropper.preview')" :style="circled ? { borderRadius: '50%' } : {}" />
        </div>
        <template v-if="previewSource">
          <div :class="`${prefixCls}-group`">
            <img :src="previewSource" :class="`${prefixCls}-preview-img-1`" :style="circled ? { borderRadius: '50%' } : {}" />
            <img :src="previewSource" :class="`${prefixCls}-preview-img-2`" :style="circled ? { borderRadius: '50%' } : {}" />
            <img :src="previewSource" :class="`${prefixCls}-preview-img-3`" :style="circled ? { borderRadius: '50%' } : {}" />
            <img :src="previewSource" :class="`${prefixCls}-preview-img-4`" :style="circled ? { borderRadius: '50%' } : {}" />
          </div>
        </template>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import type { CropendResult, Cropper } from './typing';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref } from 'vue';
  import CropperImage from './Cropper.vue';
  import { Space, Upload, Tooltip } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { dataURLtoBlob } from '/@/utils/file/base64Conver';
  import { isFunction } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  type apiFunParams = { file: Blob; name: string; filename: string; data?: Recordable };

  const props = {
    circled: { type: Boolean, default: true },
    uploadApi: {
      type: Function as PropType<(params: apiFunParams) => Promise<any>>,
    },
    bizPath: {
      type: String,
      required: false,
      default: 'temp',
    },
    options: { type: Object as PropType<Cropper.Options>, default: () => ({}) },
    fileSize: {
      type: Number,
      required: false,
      default: 1,
    },
  };

  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'CropperModal',
    components: { BasicModal, Space, CropperImage, Upload, Tooltip },
    props,
    emits: ['uploadSuccess', 'register'],
    setup(props, { emit }) {
      let filename = '';
      const src = ref('');
      const previewSource = ref('');
      const cropper = ref<Cropper>();
      let scaleX = 1;
      let scaleY = 1;

      const { prefixCls } = useDesign('cropper-am');
      const [register, { closeModal, setModalProps }] = useModalInner();
      const { t } = useI18n();

      // Block upload
      function handleBeforeUpload(file: File) {
        const fileSize = props.fileSize ?? 1;
        const isLt2M = file.size / 1024 / 1024 < fileSize;
        if (!isLt2M) {
          createMessage.info(`上传大小不能超过${fileSize}MB`);
          return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        src.value = '';
        previewSource.value = '';
        reader.onload = function (e) {
          src.value = (e.target?.result as string) ?? '';
          filename = file.name;
        };
        return false;
      }

      function handleCropend({ imgBase64 }: CropendResult) {
        previewSource.value = imgBase64;
      }

      function handleReady(cropperInstance: Cropper) {
        cropper.value = cropperInstance;
      }

      function handlerToolbar(event: string, arg?: number) {
        if (event === 'scaleX') {
          scaleX = arg = scaleX === -1 ? 1 : -1;
        }
        if (event === 'scaleY') {
          scaleY = arg = scaleY === -1 ? 1 : -1;
        }
        cropper?.value?.[event]?.(arg);
      }

      async function handleOk() {
        const uploadApi = props.uploadApi;
        if (uploadApi && isFunction(uploadApi)) {
          const blob = dataURLtoBlob(previewSource.value);
          try {
            setModalProps({ confirmLoading: true });
            const result = await uploadApi({ name: 'file', file: blob, data: { biz: props.bizPath }, filename });
            emit('uploadSuccess', {
              source: previewSource.value,
              data: result.data || result.message,
            });
            closeModal();
          } finally {
            setModalProps({ confirmLoading: false });
          }
        }
      }

      return {
        t,
        prefixCls,
        src,
        register,
        previewSource,
        handleBeforeUpload,
        handleCropend,
        handleReady,
        handlerToolbar,
        handleOk,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-cropper-am';

  .@{prefix-cls} {
    display: flex;

    &-left,
    &-right {
      height: 340px;
    }

    &-left {
      width: 55%;
    }

    &-right {
      width: 45%;
    }

    &-cropper {
      height: 300px;
      background: #eee;
      background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.25) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.25) 0),
        linear-gradient(45deg, rgba(0, 0, 0, 0.25) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.25) 0);
      background-position: 0 0, 12px 12px;
      background-size: 24px 24px;
    }

    &-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    &-preview {
      width: fit-content;
      height: 220px;
      margin: 0 auto;
      overflow: hidden;
      border: 1px solid @border-color-base;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-group {
      display: flex;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid @border-color-base;
      justify-content: space-around;
      align-items: center;
    }
    &-preview-img-1 {
      width: auto;
      height: 40px;
    }
    &-preview-img-2 {
      width: auto;
      height: 48px;
    }
    &-preview-img-3 {
      width: auto;
      height: 64px;
    }
    &-preview-img-4 {
      width: auto;
      height: 80px;
    }
  }
</style>
