<template>
  <div>
    <img src="" ref="snippetImage" />
  </div>
</template>

<script>
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
  }
}
</script>

<style scoped>

</style>