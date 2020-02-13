<template>
  <div :class="{ 'is-deleting': isDeleting }">
    <img
      ref="snippetImage"
      src=""
      alt=""
      width="100%" 
      @click="onItemClick(item.page_index)" 
    />
    <div class="d-flex justify-space-between">
      <v-btn
        class="font-weight-bold"
        text
        x-small
        :disabled="isDeleting"
        @click="onItemClick(item.page_index)"
      >
        From page {{item.page_index}}
      </v-btn>
      <v-btn
        x-small 
        icon
        color="error"
        :disabled="isDeleting"
        @click.stop="handleDelete(item.entity_id)"
      >
        <v-icon>delete</v-icon>
      </v-btn>
    </div>
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
  data: () => {
    return {
      isDeleting: false  
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
      this.isDeleting = true;
      this.$store.dispatch('DocumentSnippets/deleteSnippet', entity_id).then(() => {
        EventBus.$emit('handleSnippetDelete', entity_id);
        this.isDeleting = false
      })
    }
  }
}
</script>

<style lang="scss">
  .snippets-wrapper {
    max-height: 1160px;
    overflow: auto;
    .is-deleting {
      opacity: 0.6;
    }
    .snippet-item {
      background: #fff;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 23px;
      > div {
        transition: 0.3s;
      }
      img ~ div {
        padding: 5px;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .snippet-skeleton {
      margin-bottom: 23px;
      &:last-child {
        margin-bottom: 0;
      }
      .v-skeleton-loader__image {
        height: 146px;
      }
    }
  }
</style>