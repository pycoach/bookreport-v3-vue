<template>
  <v-layout wrap>
    <v-row>
      <v-col md="12" xs="12">
        <v-card>
          <v-toolbar>
            <v-card-title class="headline d-flex justify-space-between">
              Documents
              <div class="d-flex align-center">
                <v-btn outline fab small text :disabled="!filesSelected">
                  <v-icon>file_download</v-icon>
                </v-btn>
                <v-btn outline fab small text :disabled="!filesSelected">
                  <v-icon>open_with</v-icon>
                </v-btn>
                <v-btn outline fab small text :disabled="!filesSelected">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn class="btn-primary btn-primary--small ml-3" @click="$emit('onUploadClick')">
                  + Upload New
                </v-btn>
              </div>
            </v-card-title>
          </v-toolbar>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :single-select="singleSelect"
            :options.sync="options"
            item-key="EntityID"
            show-select
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
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <i class="material-icons">menu</i>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item v-for="(listItem, index) in menu" :key="index" @click="menuAction(item.action, item)">
                          <v-list-item-title>
                            {{listItem.title}}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                  <td>
                    <font-awesome-icon :icon="getIcon(item.Extension)" size="lg" pull="left" class="mr-2" />
                    {{ item.Name }}
                  </td>
                  <td>{{item.DocumentTypes | commaList}}</td>
                  <td>{{item.Trades | commaList}}</td>
                  <td>{{item.Transactions | commaList}}</td>
                  <td>{{formatDate(item.ChangedOn)}}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
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
    getSelected () {
      let selected;
      return selected = this.selected.map(item => item.Name);
    },
    filesSelected () {
      let selected = this.selected.map(item => item.Name);;
      return selected.length > 0
    }
  },
  data () {
    return {
      singleSelect: false,
      selected: [],
      headers: [
        {
          sortable: false
        },
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
      items: [
        {
          Archived: null,
          FolderID: '',
          ChangedOn: '2020-01-18T06:49:36.925309+00:00',
          Extension: 'pdf',
          Transactions: ['Test', 'Re'],
          ProjectID: '99096323556048649143987667e2e502',
          HasDuplicateFilenames: false,
          Trades: ['Test', 'Re'],
          ChangedBy: '3402092ffbe447f8ac30627e586edf8d',
          DocumentTypes: ['Fund - Financial', 'Fund - Memo', 'Investment - Financial', 'Investment - Legal', 'Investment - Memo'],
          Name: 'BookReport v3 Documentation v1.0.1',
          ProjectName: 'Test',
          EntityID: 'be49950cc3f04456a9ded27ba67f1e17',
          FolderName: '',
          HasPreview: true,
          Size: 177745
        }, {
          Archived: null,
          FolderID: '',
          ChangedOn: '2020-01-18T06:49:36.775296+00:00',
          Extension: 'xlsx',
          Transactions: ['Test', 'Re'],
          ProjectID: '99096323556048649143987667e2e502',
          HasDuplicateFilenames: false,
          Trades: ['Test', 'Re'],
          ChangedBy: '3402092ffbe447f8ac30627e586edf8d',
          DocumentTypes: ['Fund - Financial', 'Fund - Memo', 'Investment - Financial', 'Investment - Legal', 'Investment - Memo'],
          Name: 'SampleData',
          ProjectName: 'Test',
          EntityID: 'a56ba3a906314c8686658002234099e5',
          FolderName: '',
          HasPreview: false,
          Size: 65801
        }, {
          Archived: null,
          FolderID: '',
          ChangedOn: '2020-01-16T14:06:45.691482+00:00',
          Extension: 'pdf',
          Transactions: ['Test', 'Re', 'T'],
          ProjectID: '99096323556048649143987667e2e502',
          HasDuplicateFilenames: false,
          Trades: ['Test', 'Re', 'T'],
          ChangedBy: '3402092ffbe447f8ac30627e586edf8d',
          DocumentTypes: ['Fund - Financial', 'Fund - Memo', 'Investment - Financial', 'Investment - Legal', 'Investment - Memo'],
          Name: 'Reveles MVP Overview',
          ProjectName: 'Test',
          EntityID: '6fc74ada93ae4e41bcfa444cd68a6410',
          FolderName: '',
          HasPreview: true,
          Size: 40507
        }, {
          Archived: null,
          FolderID: '',
          ChangedOn: '2020-01-18T06:49:37.799123+00:00',
          Extension: 'xlsx',
          Transactions: ['Test', 'Re'],
          ProjectID: '99096323556048649143987667e2e502',
          HasDuplicateFilenames: false,
          Trades: ['Test', 'Re'],
          ChangedBy: '3402092ffbe447f8ac30627e586edf8d',
          DocumentTypes: ['Fund - Financial', 'Fund - Memo', 'Investment - Financial', 'Investment - Legal', 'Investment - Memo'],
          Name: 'Beijerprislista',
          ProjectName: 'Test',
          EntityID: '2f3e1e000bf74b03b21e384bd30116b3',
          FolderName: '',
          HasPreview: false,
          Size: 868958
        }
      ],
      options: {
        page: 1,
        sortBy: ['date'],
        itemsPerPage: 100
      },
      menu: [
        { title: 'Archive', action: 'archive' },
        { title: 'Details', action: 'details' },
        { title: 'Download', action: 'download' },
        { title: 'Move', action: 'move' },
        { title: 'Re-process', action: 'reprocess' }
      ],
    }
  },
  beforeMount() {
    const payload = {
      CurrentPage: this.options.page,
      PageSize: this.options.itemsPerPage,
      ProjectID: this.activeProject.entity_id,
      isProjectFilesOnly: true
    };
    this.$store.dispatch('loadDocuments', payload)
  },
  filters: {
    commaList (value) {
      const temp_value = value.slice();
      temp_value.sort();
      return temp_value.join(", ")
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>

</style>