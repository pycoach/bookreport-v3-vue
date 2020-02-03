<template>
  <v-col sm="12" md="7" lg="7" v-show="editMode === 'Edit'">
    <v-card>
      <v-toolbar>
        <v-card-title>Info Requests</v-card-title>
        <v-spacer />
        <v-btn 
          class="ml-5 btn-primary btn-primary--small"
          @click="onRequestInformation"
        >
          Request Info
        </v-btn>
          <v-btn 
            class="ml-5 btn-primary btn-primary--small"
            @click="onRequestDocument"
          >
            Request Doc.
          </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="5"
      />
    </v-card>
    <v-dialog persistent v-model="informationDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Request Information</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field
                label="Subject"
                clearable
                v-model="informationSubject"
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="clients"
                item-text="name"
                v-model="informationClient"
                label="To"
                return-object
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea
                label="Body"
                v-model="informationBody"
                outlined
                auto-grow
                rows="4"
                row-height="30"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="informationDialog = false">
            CANCEL
          </v-btn>
          <v-btn class="ml-5 btn-primary btn-primary--small" text @click="onSaveInformation">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="documentDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Request Document</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field 
                label="Subject"
                clearable
                v-model="documentSubject"
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="clients"
                item-text="name"
                v-model="documentClient"
                label="To"
                return-object
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-combobox
                v-model="documents"
                :items="[]"
                label="Documents"
                multiple
                chips
                :delimiters="[' ', ',']"
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea 
                label="Body"
                v-model="documentBody"
                outlined
                auto-grow
                rows="4"
                row-height="30" 
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="documentDialog=false">
            CANCEL
          </v-btn>
          <v-btn class="ml-5 btn-primary btn-primary--small" text @click="onSaveDocument">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import {mapGetters, mapState} from "vuex";

export default {
  name: 'Request',
  computed: {
    ...mapState('ProjectEditor', ['editMode', 'name', 'users', 'user_id', 'user_ids', 'description', 'clients']),
    ...mapGetters(['activeProject', 'user', 'trades', 'transactions', 'topic_types','topics', 'activeProjectIsLoading'])
  },
  data() {
    return {
      headers: [
        {
          text: 'Sent to',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Type', value: 'type' },
        { text: 'Requested info', value: 'request' },
        { text: 'Date', value: 'date' },
        { text: 'Status', value: 'status' },
  
      ],
      desserts: [
        {
          name: 'John Smith',
          type: 'Document',
          request: 'Mothly statement from bank',
          date: '1/6/2020',
          status: 'AWAITING',
        },
        {
          name: 'Sanna Sadler',
          type: 'Info',
          request: 'Financial and legal documents, investment memos, contracts, etc',
          date:  '1/6/2020',
          status: "RECEIVED",
        },
        {
          name: 'Imaani Plant',
          type: 'Document',
          request: 'Contract number - 212341',
          date:  '1/2/2020',
          status: 'AWAITING',
        },
        {
          name: 'Jaskaran Britt',
          type: 'Document',
          request: 'Investment memos',
          date:  '1/6/2020',
          status: "RECEIVED",
        },
        {
          name: 'Octavia Kaye',
          type: 'Document',
          request: 'legal document n-321',
          date:  '1/3/2020',
          status: "RECEIVED",
        },
        {
          name: 'Umayr Maldonado',
          type: 'Document',
          request: 'contracts',
          date:  '1/6/2020',
          status: "RECEIVED",
        },
        {
          name: 'Halle Charles',
          type: 'Info',
          request: 'All contracts that you have',
          date:  '1/2/2020',
          status: "COMPLETE",
        },
        {
          name: 'Sapphire Arnold',
          type: 'Document',
          request: 'contracts',
          date:  '1/1/2020',
          status: "PENDING",
        },
        {
          name: 'Umayr Maldonado',
          type: 'Info',
          request: 'Financial memos, contracts, etc',
          date:  '1/6/2020',
          status: "RECEIVED",
        },
        {
          name: 'Kevin Frey',
          type: 'Document',
          request: 'Contracts financial and legal documents, investment memos,etc',
          date:  '1/6/2020',
          status: "PENDING",
        },
      ],
      informationDialog: false,
      informationSubject: '',
      informationBody: '',
      informationClient: null,
      documentDialog: false,
      documentSubject: '',
      documentBody: '',
      documents: [],
      documentClient: null,
    }
  },
  methods: {
    onRequestInformation(){
      this.informationSubject = this.name + ' Information Request';
      this.informationDialog = true
    },
    onSaveInformation() {
      const payload = {
        'subject': this.informationSubject,
        'project_id': this.activeProject.entity_id,
        'project_name': this.activeProject.name,
        'body': this.informationBody,
        'user_id': this.informationClient.user_id,
        'user_name': this.informationClient.name
      };
      this.$store.dispatch('saveRequestInformation', payload);
      this.informationDialog = false
    },
    onRequestDocument(){
      this.documents = [];
      this.documentSubject = this.name + ' Document Request';
      this.documentDialog = true
    },
    onSaveDocument() {
      let document_list = {};
      for(let i = 0; i < this.documents.length; i ++){
        document_list[this.documents[i]] = 'requested'
      }
      const payload = {
        'subject': this.documentSubject,
        'project_id': this.activeProject.entity_id,
        'project_name': this.activeProject.name,
        'body': this.documentBody,
        'documents': document_list,
        'user_id': this.documentClient.user_id,
        'user_name': this.documentClient.name
      };
      this.$store.dispatch('saveRequestDocument', payload);
      this.documentDialog = false
    }
  }
}
</script>

<style scoped>

</style>