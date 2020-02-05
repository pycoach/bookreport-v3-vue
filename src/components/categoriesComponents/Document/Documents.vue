<template>
  <v-layout wrap>
    <v-row>
      <v-col md="12" xs="12">
        <v-card>
          <v-toolbar>
            <v-card-title class="headline d-flex justify-space-between">
              Documents
              <div class="d-flex align-center">
                <v-btn fab small text :disabled="!filesSelected">
                  <v-icon>file_download</v-icon>
                </v-btn>
                <v-btn fab small text :disabled="!filesSelected">
                  <v-icon>open_with</v-icon>
                </v-btn>
                <v-btn fab small text :disabled="!filesSelected">
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
                <tr v-for="item in items" :key="item.name">
                  <td>
                    <div class="d-flex align-center">
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
                  <!-- // Actions Menu must be activated as soon as actions are ready-->
                  <td>
<!--                    <v-menu offset-y>-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <v-btn-->
<!--                          icon-->
<!--                          v-bind="attrs"-->
<!--                          v-on="on"-->
<!--                        >-->
<!--                          <i class="material-icons">menu</i>-->
<!--                        </v-btn>-->
<!--                      </template>-->
<!--    -->
<!--                      <v-list>-->
<!--                        <v-list-item v-for="(listItem, index) in menu" :key="index" @click="menuAction(item.action, item)">-->
<!--                          <v-list-item-title>-->
<!--                            {{listItem.title}}-->
<!--                          </v-list-item-title>-->
<!--                        </v-list-item>-->
<!--                      </v-list>-->
<!--                    </v-menu>-->
                    <v-btn 
                      fab 
                      small 
                      text 
                      @click="handlePreviewFileDialog(item)"
                    >
                      <v-icon>remove_red_eye</v-icon>
                    </v-btn>
                  </td>
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
  </v-layout>
</template>

<script>
import moment from 'moment';
import {mapGetters} from 'vuex';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import * as far from '@fortawesome/fontawesome-free-regular/index';
import { EventBus } from '../../../components/categoriesComponents/Document/eventBus.js';
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
      return selected = this.selected.map(item => item.Name);
    },
    filesSelected () {
      let selected = this.selected.map(item => item.Name);
      return selected.length > 0
    }
  },
  data () {
    return {
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
        },
        {
          text: "Actions",
          value: "actions"
        }
      ],
      options: {
        page: 1,
        sortBy: ['date'],
        itemsPerPage: 15
      },
      menu: [
        { title: 'Archive', action: 'archive' },
        { title: 'Details', action: 'details' },
        { title: 'Download', action: 'download' },
        { title: 'Move', action: 'move' },
        { title: 'Re-process', action: 'reprocess' }
      ]
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
    handleUploadDialog () {
      EventBus.$emit('onUploadClick')
    },
    formatDate (value){
      return moment(value).format('L')
    },
    menuAction (action, item) {
      console.log('action', action);
      console.log('item', item);
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
    handlePreviewFileDialog (item) {
      const extension = item.extension.toLowerCase();
      if (extension !== "zip") {
        if (extension === "csv" || extension.includes("xls")) {
          EventBus.$emit('onPreviewExcel', item);
        } else {
          EventBus.$emit('onPreviewDocument', item)
        }
      }
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