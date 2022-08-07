<template>
  <HeaderTrigger />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import HeaderTrigger from './HeaderTrigger.vue';

  export default defineComponent({
    name: 'LayoutTrigger',
    components: {
      HeaderTrigger: HeaderTrigger,
    },
  });
</script>
