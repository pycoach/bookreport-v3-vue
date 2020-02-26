<template>
  <v-layout wrap class="mt-4">
    <v-row>
      <v-col md="12" xs="12">
        <v-card>
          <v-toolbar>
            <v-card-title class="headline d-flex justify-space-between">
              Documents
               <div class="vertical-divider vertical-divider--small" />
                <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="" />
                <v-text-field
                  class="card-search"
                  @input="onSearch"
                  v-model="searchQuery" 
                  placeholder="Find Documents"
                >
                </v-text-field>
              <div class="d-flex align-center">
                <v-btn fab small text disabled>
                  <v-icon>file_download</v-icon>
                </v-btn>
                <v-btn fab small text :disabled="!filesSelected" @click="deleteDocuments">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn class="btn-primary btn-primary--small ml-3" @click="handleUploadDialog">
                  + Upload New
                </v-btn>
              </div>
            </v-card-title>
          </v-toolbar>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="getDocuments"
            :server-items-length="getDocumentsCount"
            :single-select="singleSelect"
            :options.sync="options"
            :loading="documentsLoading"
            item-key="entity_id"
            show-select
            hide-default-footer
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr 
                  v-for="item in items" 
                  :key="item.entity_id"
                  @click.stop="handlePreviewFile(item)"
                >
                  <td>
                    <div class="d-flex align-center" @click.stop>
                      <v-checkbox
                        class="ma-0"
                        color="dark"
                        hide-details
                        :value="selected.includes(item) && true"
                        @change="selectItem($event, item)"
                      />
                    </div>
                  </td>
                  <td>
                    <font-awesome-icon :icon="getIcon(item.extension)" size="lg" pull="left" class="mr-2" />
                    {{ item.name }}
                  </td>
                  <td>{{item.document_types | commaList}}</td>
                  <td>{{item.trades | commaList}}</td>
                  <td>{{item.transactions | commaList}}</td>
                  <td>{{formatDate(item.changed_on)}}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <v-pagination 
            v-model="options.page" 
            :length="Math.ceil( getDocumentsCount / options.itemsPerPage || 1)"
            :total-visible="4"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="deleteDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">Confirm that you want to archive the selected files.</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            class="ml-5 btn-primary btn-primary--small text-uppercase"
            text
            :disabled="isDeleting"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from 'moment';
import {mapGetters} from 'vuex';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import * as far from '@fortawesome/fontawesome-free-regular/index';
import { EventBus } from '../../../components/categoriesComponents/Document/eventBus.js';
import Vue from "vue";
export default {
  name: 'Documents',
  props: {
    onUploadClick: {
      type: Function,
      default: null
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    ...mapGetters(['activeProject', 'user']),
    ...mapGetters('ProjectDocuments', ['searchOptions', 'searchLastPayload', 'getDocuments', 'getDocumentsCount', 'documentsLoading']),
    getSelected () {
      let selected;
      return selected = this.selected.map(item => item.entity_id);
    },
    filesSelected () {
      let selected = this.selected.map(item => item.Name);
      return selected.length > 0
    }
  },
  data () {
    return {
      searchQuery: null,
      timer: null,
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        {
          text: "Document Type(s)",
          value: "document_types",
          align: "left"
        },
        {
          text: "Trade(s)",
          value: "trades",
          align: "left"
        },
        {
          text: "Transaction(s)",
          value: "transactions",
          align: "left"
        },
        {
          text: "Date modified",
          value: "date"
        }
      ],
      options: {
        page: 1,
        sortBy: ['date'],
        itemsPerPage: 15
      },
      deleteDialog: false,
      isDeleting: false
    }
  },
  filters: {
    commaList (value) {
      const temp_value = value.slice();
      temp_value.sort();
      return temp_value.join(", ")
    }
  },
  methods: {
    onSearch(value) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('ProjectDocuments/loadDocuments', { 
          project_id: this.activeProject.entity_id, 
          basic: value 
        })
      }, 500);
    },
    resetForm () {
      this.$refs.form.reset()
    },
    handleUploadDialog () {
      EventBus.$emit('onUploadClick')
    },
    formatDate (value){
      return moment(value).format('L')
    },
    getIcon (extension) {
      let ext = extension.toLowerCase();
      if (ext === 'txt' || ext === 'rtf' || ext === 'text') {
        return far.faFileAlt
      } else if (ext === 'zip' || ext === 'rar') {
        return far.faFileArchive
      } else if (ext === 'mp3' || ext === 'wav' || ext === 'mid') {
        return far.faFileAudio
      } else if (ext === 'js' || ext === 'html' || ext === 'htm' || ext === 'cpp') {
        return far.faFileCode
      } else if (ext === 'xls' || ext === 'xlsx') {
        return far.faFileExcel
      } else if (ext === 'png' || ext === 'jpg') {
        return far.faFileImage
      } else if (ext === 'pdf') {
        return far.faFilePdf
      } else if (ext === 'ppt' || ext === 'pptx') {
        return far.faFilePowerpoint
      } else if (ext === 'avi' || ext === 'mp4' || ext === 'flv') {
        return far.faFileVideo
      } else if (ext === 'doc' || ext === 'docx') {
        return far.faFileWord
      }
      return far.faFile
    },
    selectItem (e, item) {
      let indexOfItem = this.selected.indexOf(item);
      if (indexOfItem < 0) {
        this.selected.push(item);
      } else {
        this.selected.splice(indexOfItem, 1)
      }
    },
    showExcel (item) {
      window.open(`/excel/viewer/${item.project_id}/${item.file_id}/${item.name}`)
    },
    handlePreviewFile (item) {
      const extension = item.extension.toLowerCase();
      if (extension !== "zip") {
        if (extension === "csv" || extension.includes("xls")) {
          this.showExcel(item)
        } else {
          EventBus.$emit('onPreviewDocument', item)
        }
      }
    },
    deleteDocuments () {
      const selectedFileIds = this.getSelected;
      if (!selectedFileIds) return;
      this.deleteDialog = true;
    },
    async confirmDelete () {
      let promises = [];
      const selectedDocumentIds = this.getSelected;
      this.isDeleting = true
      let self = this;
      function deleteRequest(id) {
        return new Promise(function(resolve) {
          self.$store.dispatch('ProjectDocuments/deleteDocument', id).then(() => {
            resolve()
          })
        })
      }
      for (let i = 0; i < selectedDocumentIds.length; i++) {
        promises.push(await deleteRequest(selectedDocumentIds[i]));
      }
      Promise.all(promises).then(() => {
        console.log(promises)
        this.selected = [];
        this.deleteDialog = false;
        this.isDeleting = false;
        this.$store.dispatch('ProjectDocuments/loadDocuments', {
          ...this.searchLastPayload,
          project_id: this.activeProject.entity_id
        });
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Files are deleted'
        })
      })
    }
  },
  watch: {
    'options': {
      handler: function (newOptions) {
        this.$store.commit('ProjectDocuments/setOptions', newOptions);
        this.$store.dispatch('ProjectDocuments/loadDocuments', {
          ...this.searchLastPayload,
          project_id: this.activeProject.entity_id
        });
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>