<template>
  <div>
    <div class="d-flex justify-space-between base-y-padding">
      <div class="d-flex align-center">
        <img 
          style="cursor: pointer" 
          class="mr-4" 
          src="../../../assets/icons/back.svg" 
          alt=""
          @click="$router.push('/project')"
        >
        <quick-edit 
          class="top-header"
          :emptyText="editMode === 'Create'  ?  'Create Project' : 'Loading'"
          :value="name"
          @input="saveProject({name: $event, description})"
        >
          <template v-slot:button-cancel>
            <img class="close-icon" src="../../../assets/icons/close.svg" alt="" />
          </template>
          <template v-slot:button-ok>
            <img class="check-icon" src="../../../assets/icons/check.svg" alt="" />
          </template>
        </quick-edit>
      </div>
    </div>

    <!-- Dialogs -->
    <v-dialog persistent v-model="fileDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Upload Files</v-card-title>
        <v-container grid-list-xl fluid >
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
          <v-spacer />
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
    <!-- Layout -->
    <v-tabs 
      :ripple="false"
      class="base-y-padding top-custom-tabs" >
      <v-tab :disabled="activeProjectIsLoading">Overview</v-tab>
      <v-tab :disabled="activeProjectIsLoading">Trades and transactions</v-tab>
      <v-tab :disabled="activeProjectIsLoading">Documents</v-tab>
      <v-tab :disabled="activeProjectIsLoading">Reports</v-tab>
      <v-tab :disabled="activeProjectIsLoading">Workesheet</v-tab>
      <v-tab :disabled="activeProjectIsLoading">Topic</v-tab>
      <v-tab :disabled="activeProjectIsLoading">Users</v-tab>
  
      <v-tab-item key="1" class="overview">
        <Overview @onSave="saveProject($event)"/>
      </v-tab-item>
  
      <v-tab-item key="2" class="trades-transactions">
        <v-row class="mb-6" v-show="editMode === 'Edit'">
          <Trades/>
          <Transactions/>
        </v-row>
      </v-tab-item>
  
      <v-tab-item key="3">
        <Search/>
        <FiltersList/>
        <Documents @onUploadClick="onUploadFile"/>
      </v-tab-item>
  
      <v-tab-item key="4">
        <v-layout row wrap></v-layout>
      </v-tab-item>
  
      <v-tab-item key="5">
        <v-layout row wrap></v-layout>
      </v-tab-item>
  
      <v-tab-item key="6">
        <v-row class="mb-6" v-show="editMode === 'Edit'">
          <TopicTypes/>
          <Topics/>
        </v-row>
      </v-tab-item>
  
      <v-tab-item key="7">
        <v-row class="mb-6" v-show="editMode === 'Edit'">
          <Users/>
        </v-row>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import QuickEdit from 'vue-quick-edit';
import Dropzone from '../../../components/categoriesComponents/Dropzone/VueDropzone';
import moment from 'moment'
import Overview from '../../../components/categoriesComponents/Overview'
import Trades from '../../../components/categoriesComponents/TradesTransactions/Trades'
import Transactions from '../../../components/categoriesComponents/TradesTransactions/Transactions'
import TopicTypes from '../../../components/categoriesComponents/Topic/TopicTypes'
import Topics from '../../../components/categoriesComponents/Topic/Topics'
import Users from '../../../components/categoriesComponents/Users/Users'
import Search from "../../../components/categoriesComponents/Document/Search/Search";
import FiltersList from "../../../components/categoriesComponents/Document/Filter";
import Documents from "../../../components/categoriesComponents/Document/Documents";
export default {
  name: 'ProjectEditor',
  components: { 
    QuickEdit,
    Overview,
    Trades,
    Transactions,
    TopicTypes,
    Topics,
    Users,
    Dropzone,
    Search,
    FiltersList,
    Documents
  },
  props: ['id'],
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
    this.$store.commit('ProjectEditor/setUserId', this.user.entity_id);
    if (this.id !== 'new') {
      this.$store.commit('ProjectEditor/setEditMode', 'Edit');
      this.$store.commit('setActiveProject', {user_id: this.user_id})
      this.$store.dispatch('getProject', this.id)
      this.$store.dispatch('loadTrades', this.id)
      this.$store.dispatch('loadTransactions', this.id)
      this.$store.dispatch('loadTopicTypes', this.id)
      this.$store.dispatch('loadTopics', this.id)
    } else {
      this.$store.commit('ProjectEditor/setEditMode', 'Create');
      this.$store.commit('setActiveProject', {user_id: this.user_id})
    }    
  },
  computed: {
    ...mapGetters(['activeProject', 'user', 'activeProjectIsLoading']),
    ...mapGetters('ProjectDocuments', ['searchLastPayload']),
    ...mapState('ProjectEditor', ['editMode', 'name', 'users', 'user_id', 'user_ids', 'description', 'clients']),
    selectedTradeList () {
      return this.selectedDocumentTrades.join()
    },
    selectedTransactionList () {
      return this.selectedDocumentTransactions.join()
    },
    selectedDocumentTypeList () {
      return this.selectedDocumentTypes.join()
    },

  },
  methods: {
    async saveProject(e) {
      this.$store.commit('ProjectEditor/setName', e.name);
      var _this = this;
      if (this.users.length === 0){
        this.$store.commit('ProjectEditor/setUsers', [{
          'user_id': this.user_id,
          'name': this.user.name,
          'role': 'provider admin'
        }])
      }

      if (this.user_ids.length === 0) {
        this.$store.commit('ProjectEditor/setUserIds', [this.user_id])
      }
      this.setValues(this, this.activeProject);

      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error'] && window.location.pathname !== '/Projecteditor/' + project.entity_id ) {
          _this.$router.push('/Projecteditor/' + project.entity_id);
          _this.$store.commit('ProjectEditor/setEditMode', 'Edit');
        }
      })
    },
    setValues(source, destination) {      
      destination['version'] = source['version']
      if (source['id'] !== 'new') {
        destination['entity_id'] = source['id']
      }     
      destination['name'] = source['name']
      destination['user_id'] = source['user_id']
      destination['users'] = source['users']
      destination['user_ids'] = source['user_ids']
      destination['description'] = source['description']
    },
 
    onUploadFile() {
      this.fileDialog = true;
    },
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
      const now = new Date();
      let newUploadSet = {
        'start_time_utc': moment.utc(now).format(),
        'start_time_local': moment(now).format()
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
        'Transactions': this.selectedTransactionList,
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
      this.selectedDocumentTypes = '';
      this.selectedDocumentTransactions = '';
      this.selectedDocumentTrades = '';
      this.$refs.dropzone.dropzone.removeAllFiles(true);
      this.uploading = false
    },
  },
  watch: {
    activeProject() {
      if (this.activeProject) {
        this.$store.commit('ProjectEditor/setName', this.activeProject.name);
        this.$store.commit('ProjectEditor/setUserId', this.activeProject.user_id);
        this.$store.commit('ProjectEditor/setDescription', this.activeProject.description);
        if (this.activeProject.users === undefined) {
          this.activeProject.users = [];
          this.$store.commit('ProjectEditor/setUsers', []);
        } else {
          this.$store.commit('ProjectEditor/setUsers', this.activeProject.users);
        }
      
        const clients = [];
        this.$store.commit('ProjectEditor/setClients', clients);
        for (let i = 0; i < this.activeProject.users.length; i++) {
          const user = this.activeProject.users[i];
          if (user.role === 'client manager' || user.role === 'client analyst' || user.role === 'participant') {
            clients.push(user)
          }
        }
        this.$store.commit('ProjectEditor/setClients', clients);
  
        if (this.activeProject.user_ids === undefined) {
          this.activeProject.user_ids = [];
          this.$store.commit('ProjectEditor/setUserIds', []);
        } else {
          this.$store.commit('ProjectEditor/setUserIds', this.activeProject.user_ids);
        }
      }
    }
  }
}
</script>
<style>
.topictype-table {
  border-collapse: collapse;
}
.topictype-table th, .topictype-table td {
  border: 1px solid black;
}
</style>