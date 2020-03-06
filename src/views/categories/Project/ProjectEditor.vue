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
    
    <!-- Layout -->
    <v-tabs 
      :ripple="false"
      class="base-y-padding top-custom-tabs" >
      <v-tab :disabled="activeProjectIsLoading">Overview</v-tab>
      <v-tab :disabled="shouldDisableTab">Trades and transactions</v-tab>
      <v-tab :disabled="shouldDisableTab">Documents</v-tab>
      <v-tab :disabled="shouldDisableTab">Reports</v-tab>
      <v-tab :disabled="shouldDisableTab">Workesheet</v-tab>
      <v-tab :disabled="shouldDisableTab">Topic</v-tab>
      <v-tab :disabled="shouldDisableTab">Users</v-tab>
  
      <v-tab-item key="1" class="overview">
        <v-row class="mb-6">
          <Description @onSave="saveProject($event)" />
          <Request />
        </v-row>
      </v-tab-item>
  
      <v-tab-item key="2" class="trades-transactions">
        <v-row class="mb-6" v-show="editMode === 'Edit'">
          <Trades />
          <Transactions />
        </v-row>
      </v-tab-item>
  
      <v-tab-item key="3">
        <template v-if="(filterType == 'show' && searchType == 'advanced') || (filterType == 'show' && searchType == 'hidden') || (filterType == 'hidden' && searchType == 'hidden')">  
           <Search/>
           <FiltersList />
        </template>
         <template v-if="(filterType == 'hidden' && searchType == 'advanced')">  
           <FiltersList />
           <Search/>
        </template>
        <Documents onPreviewExcel="previewExcel" />
        <UploadDialog />
        <PreviewDialog />
      </v-tab-item>
  
      <v-tab-item key="4">
        <Reports />
      </v-tab-item>
  
      <v-tab-item key="5">
        <v-layout row wrap></v-layout>
      </v-tab-item>
  
      <v-tab-item key="6">
        <v-row class="mb-6" v-show="editMode === 'Edit'">
          <TopicTypes />
          <Topics />
        </v-row>
      </v-tab-item>
  
      <v-tab-item key="7">
        <v-row class="mb-6" v-show="editMode === 'Edit'">
          <Users />
        </v-row>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import QuickEdit from 'vue-quick-edit';
import Dropzone from '@/components/categoriesComponents/Dropzone/VueDropzone';
export default {
  name: 'ProjectEditor',
  components: {
    QuickEdit,
    Dropzone,
    'Overview': () => import('@/components/categoriesComponents/Overview'),
    'Description': () => import('@/components/categoriesComponents/Overview/Description'),
    'Request': () => import('@/components/categoriesComponents/Overview/Request'),
    'Trades': () => import('@/components/categoriesComponents/TradesTransactions/Trades'),
    'Transactions': () => import('@/components/categoriesComponents/TradesTransactions/Transactions'),
    'TopicTypes': () => import('@/components/categoriesComponents/Topic/TopicTypes'),
    'Topics': () => import('@/components/categoriesComponents/Topic/Topics'),
    'Users': () => import('@/components/categoriesComponents/Users/Users'),
    'UploadDialog': () => import('@/components/categoriesComponents/Document/DocumentUploadDialog'),
    'PreviewDialog': () => import('@/components/categoriesComponents/Document/DocumentFile/PreviewDialog'),
    'Search': () => import('@/components/categoriesComponents/Document/DocumentSearch'),
    'FiltersList': () => import('@/components/categoriesComponents/Document/DocumentFilter'),
    'Documents': () => import('@/components/categoriesComponents/Document/Documents'),
    'Reports': () => import('@/components/categoriesComponents/Report/Reports'),
  },
  props: ['id'],
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
      this.$store.dispatch('loadReports', this.id)
      this.$store.dispatch('loadReport_objects', this.id)
    } else {
      this.$store.commit('ProjectEditor/setEditMode', 'Create');
      this.$store.commit('setActiveProject', {user_id: this.user_id})
    }    
  },

  computed: {
    ...mapGetters('ProjectDocuments', ['searchType']),
    ...mapGetters('ProjectDocuments', ['filterType']),
    ...mapGetters(['activeProject', 'user', 'activeProjectIsLoading']),
    ...mapGetters('ProjectDocuments', ['searchLastPayload']),
    ...mapState('ProjectEditor', ['editMode', 'name', 'users', 'user_id', 'user_ids', 'description', 'clients']),
    shouldDisableTab () {
      return this.activeProjectIsLoading || this.id === 'new'
    }
  },
  
  methods: {
    async saveProject(e) {
      this.$store.commit('ProjectEditor/setName', e.name);
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

      let ret = await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error'])return true
        else return false
      })
      if(ret)this.$router.push('/project');
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
    }
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