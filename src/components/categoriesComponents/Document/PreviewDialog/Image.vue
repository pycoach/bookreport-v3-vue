<template>
  <div id="page">
    {{isLoading}}
    <v-skeleton-loader
      v-if="isLoading"
      loading
      boilerplate
      type="image"
      class="mx-auto"
    />
    <img :src="image" width="100%" alt="" />
    <canvas id="image-display" ref="imageDisplayRef" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'PreviewImage',
  computed: {
    ...mapState('FilePreview', ['pageMap', 'image', 'isLoading'])
  }
}
</script>

<style scoped>

</style>