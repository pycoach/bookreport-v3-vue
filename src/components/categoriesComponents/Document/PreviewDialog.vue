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
            <!--<h4>file - {{file}}</h4>-->
            <v-slider
              v-model="sliderValue"
              persistent-hint
              step="1"
              max="10"
              inverse-label
              thumb-label="always"
              ticks
            />
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
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <!--<h1>{{item.entity_id}}</h1>-->
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
      transactions: [],
      selectedTransactions: [],
      trades: [],
      selectedTrades: []
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
    requestPreview () {
      const payload = {
        id: this.file.file_id,
        size: 'preview',
        fileName: 'page_map.json'
      };
      this.$store.dispatch('FilePreview/loadPageMap', payload);
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
    }
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
      // Make the API request to bring the data 
      // this.requestPreview()
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

<style scoped>

</style>