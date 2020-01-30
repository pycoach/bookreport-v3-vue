<template>
  <v-form ref="form" @submit.prevent="true">
    <v-layout wrap>
      <v-row>
        <v-col md="12" xs="12">
          <v-card>
            <v-toolbar>
              <v-card-title class="headline">
                Filter
              </v-card-title>
            </v-toolbar>
            <v-expansion-panels>
              <v-expansion-panel class="exclude-shadow">
                <v-expansion-panel-header>
                  <span v-html="filterText()" />
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-container fluid class="pt-0">
                    <v-layout row>
                      <v-flex xs4 class="d-flex align-center justify-center px-4">
                        <v-btn 
                          color="primary"
                          text
                          @click="resetForm"
                          :disabled="documentsLoading"
                        >
                          <i class="material-icons">refresh</i>
                          Clear Filter
                        </v-btn>
                      </v-flex>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="uploadSet"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="filterByUploadSet"
                          item-text="text"
                          item-value="value"
                          ref="uploadSetSelect"
                          label="All upload sets"
                          single-line
                          class="wideSelect"
                        />
                      </v-flex>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="duplicate"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="duplicateOptions"
                          label="Both duplicate and not"
                          single-line
                          class="wideSelect"
                        />
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="trade"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="filterByTrade"
                          item-text="text"
                          item-value="value"
                          label="All trades"
                          single-line
                        />
                      </v-flex>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="transaction"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="filterByTransaction"
                          item-text="text"
                          item-value="value"
                          label="All transactions"
                          single-line
                        />
                      </v-flex>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="documentType"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="filterByDocumentTypes"
                          item-text="text"
                          item-value="value"
                          label="All document types"
                          single-line
                          class="wideSelect"
                        />
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="size"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="filterByFileSizes"
                          item-text="text"
                          item-value="value"
                          label="All file sizes"
                          single-line
                        />
                      </v-flex>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="type"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="filterByFileTypes"
                          item-text="text"
                          item-value="value"
                          label="All file types"
                          single-line
                        />
                      </v-flex>
                      <v-flex xs4 class="px-4">
                        <v-select
                          v-model="supported"
                          @change="getDocuments"
                          :disabled="documentsLoading"
                          :items="supportedOptions"
                          label="Both supported and not"
                          single-line
                        />
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </v-form>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
export default {
  name: 'FiltersList',
  data () {
    return {
      uploadSet: null,
      duplicate: null,
      trade: null,
      transaction: null,
      documentType: null,
      size: null,
      type: null,
      supported: null,
      supportedOptions: ['Both supported and not', 'Supported', 'Unsupported'],
      duplicateOptions: ['Both duplicate and not', 'Exclude duplicates', 'Duplicates only']
    }
  },
  computed: {
    ...mapGetters(['activeProject']),
    ...mapGetters('ProjectDocuments', ['documentsLoading']),
    ...mapState('ProjectDocuments', ['filterByUploadSet', 'filterByTrade', 'filterByTransaction', 'filterByDocumentTypes', 'filterByFileSizes', 'filterByFileTypes', 'searchLastPayload'])
  },
  methods: {
    getDocuments () {
      this.$store.dispatch('ProjectDocuments/loadDocuments', {
        project_id: this.activeProject.entity_id,
        upload_set: this.uploadSet,
        trade: this.trade,
        transaction: this.transaction,
        document_types: this.documentType,
        file_size: this.size || null,
        extension: this.type,
        supported: this.supported,
        duplicate: this.duplicate
      });
    },
    resetForm () {
      this.$refs.form.reset();
      this.getDocuments();
    },
    filterText () {
      let text = '';
      let first = true;
    
      if (this.uploadSet) {
        if (!first) text = text + ', ';
        let index = this.filterByUploadSet.findIndex(item => item.value === this.uploadSet);
        text = text + `<strong>Upload Set:</strong> ${this.filterByUploadSet[index] && this.filterByUploadSet[index]['text']}`;
        first = false
      }
    
      if (this.duplicate) {
        if (!first) text = text + ', ';
        text = `${text} <strong>${this.duplicate}</strong>`;
        first = false
      }
    
      if (this.trade) {
        if (!first) text = text + ', ';
        text = text + `<strong>Trade:</strong> ${this.trade}`;
        first = false
      }
    
      if (this.transaction) {
        if (!first) text = text + ', ';
        text = text + `<strong>Transaction:</strong> ${this.transaction}`;
        first = false
      }
    
      if (this.documentType) {
        if (!first) text = text + ', ';
        text = text + `<strong>Document Type:</strong> ${this.documentType}`;
        first = false
      }
    
      if (this.size && this.size >= 0) {
        if (!first) text = text + ', ';
        let index = this.filterByFileSizes.findIndex(item => item.value === this.size);
        text = text + `<strong>Size:</strong> ${this.filterByFileSizes[index] && this.filterByFileSizes[index]['text']}`;
        first = false
      }
    
      if (this.type) {
        if (!first) text = text + ', ';
        text = text + `<strong>File Type:</strong> ${this.type}`;
        first = false
      }
    
      if (this.supported) {
        if (!first) text = text + ', ';
        text = `${text} <strong>${this.supported}</strong> file types only`;
        first = false
      }
    
      if (text.length > 0) {
        return text
      }
    
      return '<strong>No Filter Applied</strong>'
    }
  }
}
</script>

<style scoped>
  .exclude-shadow:before {
    box-shadow: none !important;
  }
</style>