<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Preview - {{file.name}}</v-toolbar-title>
      </v-toolbar>
      <v-container class="mt-5">
        <v-row>
          <v-col cols="6">
            <v-slider
              v-model="sliderValue"
              :disabled="isLoadingPreview"
              persistent-hint
              step="1"
              min="1"
              :max="pageMap.pages && pageMap.pages.length"
              inverse-label
              thumb-label="always"
              ticks
              @change="requestDocumentType($event, 0)"
            />
            <div class="preview-image">
              <v-skeleton-loader
                v-if="isLoadingPreview"
                loading
                type="image"
                class="mx-auto"
              />
              <canvas v-show="!isLoadingPreview" id="imageDisplay" ref="imageDisplayRef" />
            </div>
          </v-col>
          <v-col cols="5" offset="1">
            <v-switch
              v-model="allowSpeedEntry"
              :disabled="isLoadingPreview"
              label="'u' to skip pages and 'p' to process pages"
              color="primary"
              class="ma-0 pa-0"
            />
            <div class="d-flex mt-3">
              <v-skeleton-loader
                v-if="isLoadingDocumentEvent || isLoadingPreview"
                v-for="doc in 5"
                :key="Math.random(1, 9999)"
                type="button"
                class="doc-btn"
              />
              <v-btn
                v-if="!isLoadingDocumentEvent && !isLoadingPreview"
                v-for="(doc, index) in pageMap.pages"
                :key="Math.random(1, 9999)"
                color="default"
                text
                icon
                :class="[`doc-status-${getStatus(index + 1)}`, {'doc-active': sliderValue === index + 1 }]"
                @mouseenter="requestDocumentType(index + 1, 0)"
              >
                <i class="material-icons">insert_drive_file</i>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { EventBus } from './eventBus.js';
import PreviewImage from './PreviewImage';
export default {
  name: 'PreviewDialog',
  components: {
    PreviewImage
  },
  computed: {
    ...mapGetters('ProjectDocuments', ['getDocuments']),
    ...mapState('FilePreview', ['pageMap', 'image', 'pageStatuses', 'isLoadingPreview', 'isLoadingDocumentEvent'])
  },
  data() {
    return {
      show: false,
      item: {},
      allowSpeedEntry: false,
      sliderValue: 1,
      file: {}
    }
  },
  mounted() {
    EventBus.$on('onPreviewDocument', (item) => {
      this.show = true;
      this.item = item;
    });
    EventBus.$on('onPreviewExcel', (item) => {
      console.log('onPreviewExcel', item.file_id);
    })
  },
  methods: {
    requestPageMap () {
      const payload = {
        id: this.file.file_id,
        size: 'preview',
        fileName: 'page_map.json'
      };
      return this.$store.dispatch('FilePreview/loadPageMap', payload)
    },
    requestImage () {
      const payload = {
        id: this.file.file_id,
        size: 'preview',
        fileName: 'sprite0.png'
      };
      this.$store.dispatch('FilePreview/loadImage', payload);
    },
    addKeyDown (event) {
      if (this.show && this.allowSpeedEntry) {
        switch(event.code) {
          case 'KeyU':
            // Checks if it is the last page
            if (this.sliderValue === this.pageMap.pages.length) return;
            this.sliderValue++;
  
            // Makes the next page Unread
            this.requestDocumentType(this.sliderValue, 0);
            break;
          case 'KeyP':
            // Makes current page Processed
            this.requestDocumentType(this.sliderValue, 3);
            
            // Checks if it is the last page
            if (this.sliderValue === this.pageMap.pages.length) return;
            this.sliderValue++;
            
            // Makes the next page Unread
            this.requestDocumentType(this.sliderValue, 0);
            break;
        }
      }
    },
    renderCurrentPage () {
      if (!this.show) return;
      const canvas = this.$refs.imageDisplayRef;
      const ctx = canvas.getContext("2d");
      const imageElement = new Image();
      imageElement.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.pageMap.pages[this.sliderValue - 1][2];
        canvas.height = this.pageMap.pages[this.sliderValue - 1][3];
        ctx.drawImage(imageElement, 0, -this.pageMap.pages[this.sliderValue - 1][1]);
      };
      imageElement.src = this.image;
    },
    requestDocumentType (pageIndex = 1, eventType = 0) {
      this.sliderValue = pageIndex;
      const payload = {
        file_id: this.file.file_id,
        page_index: pageIndex,
        event_type: eventType
      };
      return this.$store.dispatch('FilePreview/loadDocumentEvent', payload)
    },
    getStatus (pageIndex) {
      let status;
      switch(this.pageStatuses[pageIndex]) {
        case 0:
          status = 'unread';
          break;
        case 3:
          status = 'processed';
          break;
      }
      return status
    }
  },
  created () {
    window.addEventListener('keydown', this.addKeyDown)
  },
  watch: {
    async item () {
      for(let i = 0; i < this.getDocuments.length; i++) {
        if (this.getDocuments[i].file_id === this.item.file_id) {
          this.file = this.getDocuments[i];
          break
        }
      }
      await this.requestPageMap();
      await this.requestImage();
      await this.requestDocumentType();
      this.$store.dispatch('FilePreview/loadPageStatus', this.file.file_id);
    },
    image (newImage) {
      if (!newImage || this.isLoadingPreview) return;
      this.sliderValue = 1;
      this.renderCurrentPage()
    },
    sliderValue () {
      this.renderCurrentPage()
    },
    selectedTrades (newTrades, oldTrades) {
      if (newTrades.length) {
        const index = newTrades.length - 1;
        if (!oldTrades.includes(newTrades[index])) {
          this.trades.push(newTrades[index])
        }
      }
    },
    selectedTransactions (newTransactions, oldTransactions) {
      if (newTransactions.length) {
        const index = newTransactions.length - 1;
        if (!oldTransactions.includes(newTransactions[index])) {
          this.transactions.push(newTransactions[index])
        }
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.addKeyDown)
  }
}
</script>

<style lang="scss">
  .preview-image {
    min-height: 750px;
    .v-skeleton-loader__image {
      min-height: 750px !important;
    }
  }
  #imageDisplay {
    border: 1px solid #949494;
    overflow: hidden;
    width: 100%;
    min-height: 750px;
  }
  .v-slider--horizontal {
    margin: 0 !important;
  }
  .doc-btn {
    width: 40px;
    margin-left: 0 !important;
    margin-right: 10px !important;;
  }
  .doc-status-processed {
    color: green !important;
  }
  .doc-active {
    &:before {
      opacity: 0.2 !important;
    }
  }
</style>