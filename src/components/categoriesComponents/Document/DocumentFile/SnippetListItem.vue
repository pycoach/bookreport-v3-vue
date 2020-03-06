<template>
  <div class="snippet-item" :class="{ 'is-deleting': isDeleting }">
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
      <div>
        <v-btn
          class="mr-1"
          x-small
          icon
          :disabled="isDeleting"
          @click="toggleTopics(item.entity_id)"
        >
          <v-icon>bookmark</v-icon>
        </v-btn>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-1"
              x-small
              icon
              :disabled="isDeleting"
              v-on="on"
              :open-on-hover="false"
              open-on-click
              @click.stop="copyUrl(item.page_index)"
            >
              <v-icon>file_copy</v-icon>
            </v-btn>
          </template>
          <span>Copy link</span>
        </v-tooltip>
        <v-btn
          x-small
          icon
          color="error"
          :disabled="isDeleting"
          @click.stop="handleDelete(item.entity_id, item.page_index)"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </div>
    </div>
    <v-expand-transition>
      <div v-if="showTopics">
        <snippet-topics :snippet-id="item.entity_id" />
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { EventBus } from '@/components/EventBus.js'; 
export default {
  name: 'SnippetItem',
  props: ['item', 'deletingSnippetIds'],
  components: {
    'snippet-topics': () => import('../DocumentSnippetTopics')
  },
  data: () => {
    return {
      isDeleting: false,
      showTopics: false
    }
  },
  mounted () {
    this.renderImage();
    EventBus.$on('toggleDocumentFileTopics', ((entity_id) => {
      if (this.item.entity_id === entity_id) return;
      this.showTopics = false
    }));
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
    handleDelete (entity_id, page_index) {
      this.isDeleting = true;
      this.$store.dispatch('DocumentSnippets/deleteSnippet', entity_id).then(() => {
        EventBus.$emit('handleSnippetDelete', { entity_id, page_index });
        this.isDeleting = false
      })
    },
    toggleTopics (entity_id) {
      EventBus.$emit('toggleDocumentFileTopics', entity_id);
      this.showTopics = !this.showTopics
    },
    copyUrl (page_index) {
      let el = document.createElement('input'), text = window.location.origin;
      text = text + '/file/viewer/' + this.$route.params.project_id + '/' + this.$route.params.id + '/' + page_index;
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  },
  watch: {
    snippet () {
      this.renderImage()
    },
    deletingSnippetIds () {
      if (this.deletingSnippetIds.includes(this.item.entity_id)) {
        this.isDeleting = true
      }
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
      img {
        cursor: pointer;
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
    .v-list-item.pa-4 {
      padding: 0 !important;
    }
    .v-list-item--active::before {
      background: currentColor;
      opacity: 0.16;
    }
    &.v-list-group--active {
      background-color: rgba(0, 0, 0, 0.04);
    }
    .v-tabs-items {
      background: transparent;
    }
    .v-item-group {
      overflow-y: hidden;
    }
    .v-tab {
      font-size: 0.7rem;
      font-weight: 600;
      align-items: center !important;
      padding: 12px;
    }
    .v-slide-group__next, .v-slide-group__prev {
      flex: 0 1 35px;
      min-width: 35px;
    }
    .v-alert {
      font-weight: 500;
      font-size: 13px;
    }
  }
</style>