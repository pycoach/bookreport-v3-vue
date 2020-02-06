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
              :disabled="isLoading"
              persistent-hint
              step="1"
              min="1"
              :max="pageMap.pages && pageMap.pages.length"
              inverse-label
              thumb-label="always"
              ticks
              @change="renderCurrentPage"
            />
            <div class="preview-image">
              <v-skeleton-loader
                v-if="isLoading"
                loading
                type="image"
                class="mx-auto"
              />
              <canvas v-show="!isLoading" id="imageDisplay" ref="imageDisplayRef" />
            </div>
            
            <v-select
              v-model="selectedDocumentTypes"
              :items="documentTypes"
              label="Transactions"
              multiple chips small-chips deletable-chips clearable dense
            />
            <v-combobox
              v-model="selectedTransactions"
              :items="transactions"
              label="Transactions"
              multiple chips small-chips deletable-chips clearable dense
            />
            <v-combobox
              v-model="selectedTrades"
              :items="trades"
              label="Trades"
              multiple chips small-chips deletable-chips clearable dense
            />
          </v-col>
          <v-col cols="5" offset="1">
            <v-switch
              v-model="allowSpeedEntry"
              label="'u' to skip pages and 'p' to process pages"
              color="primary"
              class="ma-0 pa-0"
            />
            <div class="d-flex mt-3">
              <v-btn
                v-for="(doc, index) in pageMap.pages && pageMap.pages"
                color="default"
                text
                icon
                small
              >
                <i class="material-icons">insert_drive_file</i>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">

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
    ...mapState('FilePreview', ['pageMap', 'image', 'isLoading'])
  },
  data() {
    return {
      show: false,
      item: {},
      allowSpeedEntry: false,
      sliderValue: 1,
      file: {},
      sprites: {},
      documentTypes: ['Fund - Financial', 'Fund - Memo', 'Investment - Financial', 'Investment - Legal',
        'Investment - Memo', 'Investment - Value Model'],
      selectedDocumentTypes: [],
      transactions: [],
      selectedTransactions: [],
      trades: [],
      selectedTrades: [],
    }
  },
  mounted() {
    EventBus.$on('onPreviewDocument', (item) => {
      console.log('onPreviewDocument', item.file_id);
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
      this.$store.dispatch('FilePreview/loadPageMap', payload)
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
            console.log('KeyU');
            break;
          case 'KeyP':
            console.log('KeyP');
            break;
        }
      }
    },
    initDetails () {
      this.selectedDocumentTypes = JSON.parse(JSON.stringify(this.file.document_types));
      this.trades = JSON.parse(JSON.stringify(this.file.trades));
      this.selectedTrades = JSON.parse(JSON.stringify(this.file.trades));
      this.transactions = JSON.parse(JSON.stringify(this.file.transactions));
      this.selectedTransactions = JSON.parse(JSON.stringify(this.file.transactions));
    },
    renderCurrentPage () {
      const canvas = this.$refs.imageDisplayRef;
      const ctx = canvas.getContext("2d");
      const imageElement = new Image();
      imageElement.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.pageMap.pages[this.sliderValue - 1][2];
        canvas.height = this.pageMap.pages[this.sliderValue - 1][3];
        console.table('canvas.width', canvas.width, 'canvas.height', canvas.height);
        ctx.drawImage(imageElement, 0, -this.pageMap.pages[this.sliderValue - 1][1]);
      };
      imageElement.src = this.image;
    },
  },
  created () {
    window.addEventListener('keydown', this.addKeyDown)
  },
  watch: {
    item () {
      for(let i = 0; i < this.getDocuments.length; i++) {
        if (this.getDocuments[i].file_id === this.item.file_id) {
          this.file = this.getDocuments[i];
          break
        }
      }
      this.initDetails();
      this.requestPageMap();
      this.requestImage();
      this.$store.dispatch('FilePreview/loadDocumentEvent', this.file.file_id)
    },
    image (newImage) {
      if (!newImage || this.isLoading) return;
      this.sliderValue = 1;
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
    margin-bottom: 50px;
    min-height: 500px;
    .v-skeleton-loader__image {
      min-height: 500px !important;
    }
  }
  #imageDisplay {
    border: 1px solid #949494;
    overflow: hidden;
    width: 100%;
    min-height: 500px;
  }
  .v-slider--horizontal {
    margin: 0 !important;
  }
</style>