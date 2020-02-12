<template>
  <div>
    <img src="" ref="snippetImage" width="100%" @click="onItemClick(item.page_index)" />
<!--    <button @click.stop="handleDelete(item.entity_id)">Delete</button>-->
  </div>
</template>

<script>
import { EventBus } from './eventBus.js'; 
export default {
  name: 'SnippetItem',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderImage()
  },
  methods: {
    imageDataToImage (imageData) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);
      const image = new Image();
      image.src = canvas.toDataURL();
      return image;
    },
    renderImage () {
      let image = this.imageDataToImage(this.item.ImageData);
      image.draggable = false;
      this.$refs.snippetImage.src = image.src
    },
    onItemClick (page_index) {
      if (!page_index) return;
      EventBus.$emit('handleSnippetPage', page_index)
    },
    handleDelete (entity_id) {
      EventBus.$emit('handleSnippetDelete', entity_id)
    }
  }
}
</script>

<style scoped>

</style>