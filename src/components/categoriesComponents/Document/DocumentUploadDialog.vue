<template>
  <v-dialog persistent v-model="fileDialog" max-width="500">
    <v-card>
      <v-card-title class="headline">Upload Files</v-card-title>
      <v-container grid-list-xl fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-select
              v-model="selectedDocumentTypes"
              :items="documentTypes"
              label="Document Type(s)"
              multiple chips deletable-chips clearable dense
            />
          </v-flex>
          <v-flex xs12 md12>
            <v-combobox
              v-model="selectedDocumentTransactions"
              :items="documentTransactions"
              label="Transactions"
              multiple chips small-chips deletable-chips clearable dense
            />
          </v-flex>
          <v-flex xs12 md12>
            <v-combobox
              v-model="selectedDocumentTrades"
              :items="documentTrades"
              label="Trades"
              multiple chips small-chips deletable-chips clearable dense
            />
          </v-flex>
          <v-flex xs12 md12>
            <Dropzone
              ref="dropzone"
              @queuecomplete="queuecomplete"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="primary"
          text
          @click="cancelUpload"
        >
          CANCEL
        </v-btn>
        <v-btn
          class="ml-5 btn-primary btn-primary--small"
          text
          :disabled="uploading"
          :loading="uploading"
          @click="uploadFiles"
        >
          UPLOAD
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from '@/components/EventBus.js';
import Dropzone from '../../../components/categoriesComponents/Dropzone/VueDropzone';
import {mapGetters, mapState} from "vuex";
export default {
  name: 'uploadDialog',
  components: {
    Dropzone,
  },
  computed: {
    ...mapGetters(['activeProject', 'user', 'trades', 'transactions']),
    ...mapGetters('ProjectDocuments', ['searchLastPayload']),
    ...mapState('ProjectEditor', ['user_id']),
    selectedTradeList () {
      return this.selectedDocumentTrades.join()
    },
    selectedTransactionList () {
      return this.selectedDocumentTransactions.join()
    },
    selectedDocumentTypeList () {
      return this.selectedDocumentTypes.join()
    }
  },
  data() {
    return {
      fileDialog: false,
      files: [],
      documentTypes: ["Fund - Financial","Fund - Memo", "Investment - Financial", "Investment - Legal",
        "Investment - Memo", "Investment - Value Model"],
      selectedDocumentTypes: [],
      documentTransactions: [],
      selectedDocumentTransactions: [],
      documentTrades: [],
      selectedDocumentTrades: [],
      uploadSet: null,
      filesToProcess: 0,
      uploading: false,
    }
  },
  mounted() {
    EventBus.$on('onUploadClick', () => {
      this.fileDialog = true;
    })
  },
  methods: {
    queuecomplete() {
      if (this.uploading) {
        this.files = this.$refs.dropzone.dropzone.getAcceptedFiles();
        this.$store.dispatch('ProjectDocuments/loadDocuments', {
          ...this.searchLastPayload,
          project_id: this.activeProject.entity_id
        });
        this.cancelUpload()
      }
    },
    async uploadFiles () {
      let files = this.$refs.dropzone.dropzone.files;
      if (files.length === 0) return;
      let newUploadSet = {
        'start_time_utc': this.$moment.utc().format(),
        'start_time_local': this.$moment().format()
      };
      if (this.$route.params.id) newUploadSet['project_id'] = this.$route.params.id;
      newUploadSet['files'] = files.map(file => {return file['name']});
      newUploadSet['user_id'] = this.user.user_id;
      await this.saveUploadSet(newUploadSet);
      this.setFileUrls();
      this.uploading = true;
    },
    async saveUploadSet(uploadSet){
      await this.$store.dispatch('uploadDocumentFiles', uploadSet).then(res => {
        this.uploadSet = res;
      });
    },
    setFileUrls() {
      const fileCount = this.$refs.dropzone.dropzone.files.length;
      this.filesToProcess = fileCount;
      for (let i = 0; i < fileCount; i++) {
        this.setFileUrl(this.$refs.dropzone.dropzone.files[i], this.checkForUpload)
      }
    },
    setFileUrl(file, done) {
      const payload = {
        'fileName': file.name,
        'fullPath': file.fullPath || file.name,
        'contentType': file.type,
        'Transactions': this.selectedTransactionList ,
        'DocumentTypes': this.selectedDocumentTypeList,
        'Trades': this.selectedTradeList,
        'UserID': this.user.user_id,
        'ProjectID': this.$route.params.id,
        'UploadSetID': this.uploadSet ? this.uploadSet.entity_id : null
      };
      this.$store.dispatch('getSignedURL', payload)
        .then(url => {
          file.uploadURL = url.signed_url;
          if (done) done()
        })
        .catch(err => {
          if (done) done("Failed to get an S3 signed upload URL", err)
        })
    },
    checkForUpload() {
      this.filesToProcess--;
      if (this.filesToProcess < 1) {
        this.$refs.dropzone.dropzone.processQueue()
      }
    },
    cancelUpload () {
      this.fileDialog = false;
      this.selectedDocumentTypes = [];
      this.selectedDocumentTransactions = [];
      this.selectedDocumentTrades = [];
      this.$refs.dropzone.dropzone.removeAllFiles(true);
      this.uploading = false
    },
  },
  watch:{
    fileDialog() {
      if (this.fileDialog) {
        this.documentTrades = [...this.trades].map(trade => trade.name);
        this.documentTransactions = [...this.transactions].map(trade => trade.name);
      }
    }
  }
}
</script>

<style scoped>

</style>
