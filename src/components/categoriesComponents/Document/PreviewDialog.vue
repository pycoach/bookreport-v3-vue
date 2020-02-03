<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Preview - {{item.name}}</v-toolbar-title>
      </v-toolbar>
      <v-container class="mt-5">
        <v-row>
          <v-col cols="6">
<!--            <h4>File - {{file}}</h4>-->
<!--            <h2>{{getDocuments}}</h2>-->
            <v-slider
              v-model="sliderValue"
              persistent-hint
              step="1"
              max="10"
              inverse-label
              thumb-label="always"
              ticks
            />
            <v-combobox
              v-model="file.document_types"
              :items="documentTypes"
              label="Transactions"
              multiple chips small-chips deletable-chips clearable dense
            />
            <v-combobox
              v-model="selectedTransactions"
              :items="file.transactions"
              label="Transactions"
              multiple chips small-chips deletable-chips clearable dense
            />
            <v-combobox
              v-model="selectedTrades"
              :items="file.trades"
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
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h1>{{item.name}}</h1>
<!--            <h1>{{item.entity_id}}</h1>-->
            <div id="page">
              <canvas id="image-display" ref="imageDisplayRef"></canvas>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '../../../components/categoriesComponents/Document/eventBus.js';
export default {
  name: 'PreviewDialog',
  computed: {
    ...mapGetters('ProjectDocuments', ['getDocuments'])
  },
  data() {
    return {
      show: false,
      item: {},
      allowSpeedEntry: false,
      sliderValue: 10,
      file: {},
      sprites: {},
      documentTypes: ['Fund - Financial', 'Fund - Memo', 'Investment - Financial', 'Investment - Legal',
        'Investment - Memo', 'Investment - Value Model'],
      selectedDocumentTypes: [],
      selectedTransactions: [],
      selectedTrades: []
    }
  },
  mounted() {
    EventBus.$on('onPreviewDocument', (item) => {
      console.log('onPreviewDocument', item.entity_id);
      this.show = true;
      this.item = item;
    });
    EventBus.$on('onPreviewExcel', (item) => {
      console.log('onPreviewExcel', item.entity_id);
    })
  },
  methods: {
    requestPreview () {
      this.$store.dispatch('FilePreview/loadDocument', { id: this.item.entity_id })
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
    }
  },
  created () {
    window.addEventListener('keydown', this.addKeyDown)
  },
  watch: {
    item(newValue) {
      console.log('newValue', newValue);
      for(let i = 0; i < this.getDocuments.length; i++) {
        if (this.getDocuments[i].entity_id === this.item.entity_id) {
          this.file = this.getDocuments[i];
          break
        }
      }
      this.requestPreview()
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.addKeyDown)
  }
}
</script>

<style scoped>

</style>