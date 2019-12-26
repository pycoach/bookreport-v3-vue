<template>
  <div class='pa-5'>
    <v-dialog persistent v-model="userDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{userEditMode}} User</v-card-title>
        <v-container grid-list-xl fluid pt-0>
            <v-layout row wrap>
              <v-flex md12>
                <v-text-field v-if="userEditMode == 'Add'"
                v-model="username"
                required
                prepend-icon="person"
                label="Name"></v-text-field>
                <v-text-field 
                v-else :disabled="true" 
                v-model="username" 
                prepend-icon="person"
                label="Name"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex md12>
                <v-text-field 
                v-if="userEditMode == 'Add'"
                v-model="useremail"
                label="Email"
                required
                prepend-icon="mail"
                :rules="emailRules"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex md12>
                <v-select
                :items="userRoles"
                item-text="name"
                v-model="userRole"
                label="Role"
                @change="userRoleChanged"
              ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="userDialog=false">Cancel</v-btn>
          <v-btn color="green darken-1" @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="tradeDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{tradeEditMode}} Trade</v-card-title>
        <v-container grid-list-xl fluid pt-0>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Name"
                clearable
                v-model="tradeName">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Description"
                v-model="tradeDescription"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="tradeDialog=false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveTrade">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="transactionDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{transactionEditMode}} Transaction</v-card-title>
        <v-container grid-list-xl fluid pt-0>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Name"
                clearable
                v-model="transactionName">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Description"
                v-model="transactionDescription"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="trades"
                item-text="name"
                v-model="transactionTrade"
                label="Trade"
                return-object
                @change="transactionTradeChanged"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="transactionDialog=false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveTransaction">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="informationDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Request Information</v-card-title>
        <v-container grid-list-xl fluid pt-0>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Subject"
                clearable
                v-model="informationSubject">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="clients"
                item-text="name"
                v-model="informationClient"
                label="To"
                return-object
              ></v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Body"
                v-model="informationBody"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>            
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="informationDialog=false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="onSaveInformation">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="documentDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Request Document</v-card-title>
        <v-container grid-list-xl fluid pt-0>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Subject"
                clearable
                v-model="documentSubject">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="clients"
                item-text="name"
                v-model="documentClient"
                label="To"
                return-object
              ></v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-combobox
                v-model="documents"
                :items="[]"
                label="Documents"
                multiple
                chips
              ></v-combobox>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Body"
                v-model="documentBody"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>            
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="documentDialog=false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="onSaveDocument">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex xs12 md6 class="pa-5">
      <v-container grid-list-xl fluid>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-card-title
              class="headline">
              {{ editMode }} Project
            </v-card-title>
          </v-toolbar>
          <v-container grid-list-xl fluid>
            <v-layout row wrap>   
              <v-flex xs12 md12>
                <v-text-field label="Name"
                  clearable
                  v-model="name">
                </v-text-field>
              </v-flex>
              <v-flex xs12 md12>
                <v-textarea label="Description"
                  v-model="description"
                  outlined
                  auto-grow
                  rows="4"
                  row-height="30">
                </v-textarea>
              </v-flex>    
            </v-layout>
          </v-container>
          <v-card-actions>
          <v-btn color="primary" @click="onRequestInformation">
              Request Information
            </v-btn>
            <v-btn color="primary" @click="onRequestDocument">
              Request Document
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="$router.push('/Project')">
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text @click="saveProject()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
      </v-flex>
      <v-flex v-show="editMode == 'Edit'" xs12 md3 class="pa-5">
      <v-container grid-list-xl fluid>
        <v-hover>
          <v-card max-width="600" slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`">
            <v-toolbar color="primary" dark>
              <v-card-title>Trades</v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon @click="addTrade">add</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list two-line>
              <template v-for="(trade, index) in trades">
                <v-list-item
                  :key="trade.entity_id"
                  @click="editTrade(trade)">
                  <v-list-item-content>
                    <v-list-item-title v-html="trade.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-btn icon @click.stop="deleteTrade(trade.entity_id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item>
                <v-divider
                  v-if="index < trades.length - 1">
                </v-divider>
              </template>
            </v-list>
          </v-card>
        </v-hover>
      </v-container>
      <v-container grid-list-xl fluid>
        <v-hover>
          <v-card max-width="600" slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`">
            <v-toolbar color="primary" dark>
              <v-card-title>Transactions</v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon @click="addTransaction">add</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list two-line>
              <template v-for="(transaction, index) in transactions">
                <v-list-item
                  :key="transaction.entity_id"
                  @click="editTransaction(transaction)">
                  <v-list-item-content>
                    <v-list-item-title v-html="transaction.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-btn icon @click.stop="deleteTransaction(transaction.entity_id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item>
                <v-divider
                  v-if="index < transactions.length - 1">
                </v-divider>
              </template>
            </v-list>
          </v-card>
        </v-hover>
      </v-container>
      </v-flex>
      <v-flex v-show="editMode == 'Edit'" xs12 md3 class="pa-5">
      <v-container grid-list-xl fluid>
        <v-hover>
          <v-card max-width="600" slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`">
            <v-toolbar color="primary" dark>
              <v-card-title>Users</v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon @click="addUser">add</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list two-line>
              <template v-for="(user, index) in users">
                <v-list-item
                  :key="user.user_id"
                  @click="editUser(user)">
                  <v-list-item-content>
                    <v-list-item-title v-html="user.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-btn icon @click.stop="deleteUser(user.user_id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item>
                <v-divider
                  v-if="index < users.length - 1">
                </v-divider>
              </template>
            </v-list>
          </v-card>
        </v-hover>
      </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectEditor',
  props: ['id'],
  data() {
    return {
      editMode: 'Create',    
      name: '',
      user_id: null,
      users: [],
      user_ids: [],
      description: '',
      tradeName: '',
      tradeDescription: '',
      tradeDialog: false,
      tradeEditMode: 'Create',
      activeTrade: {},
      transactionName: '',
      transactionDescription: '',
      transactionTrade: null,
      transactionDialog: false,
      transactionEditMode: 'Create',
      activeTransaction: {},
      userDialog: false,
      userEditMode: 'Add',
      username: '',
      useremail: '',
      emailRules: [ v => /.+@.+/.test(v) || 'Invalid Email address' ],
      userRole: 'provider admin',
      userRoles: ['provider admin', 'provider analyst', 'client manager', 'client analyst', 'participant'],
      activeUser: null,

      informationDialog: false,
      informationSubject: '',
      informationBody: '',
      clients: [],
      informationClient: null,

      documentDialog: false,
      documentSubject: '',
      documentBody: '',
      documents: [],
      documentClient: null,
    }
  },
  mounted() {
    this.user_id = this.user.entity_id
    if (this.id !== 'new') {
      this.editMode = 'Edit'
      this.$store.commit('setActiveProject', {user_id: this.user_id})
      this.$store.dispatch('getProject', this.id)
      this.$store.dispatch('loadTrades', this.id)
      this.$store.dispatch('loadTransactions', this.id)
    } else {
      this.$store.commit('setActiveProject', {user_id: this.user_id})
    }    
  },
  computed: {
    ...mapGetters(['activeProject', 'user', 'trades', 'transactions']),
  },
  methods: {
    async saveProject() {
      if (this.users.length == 0){
        this.users = [{
          'user_id': this.user_id,
          'name': this.user.name,
          'role': 'provider admin'
        },]
      }

      if (this.user_ids.length == 0) {
        this.user_ids = [this.user_id,]
      }
      this.setValues(this, this.activeProject)

      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error']) {
          window.location = '/Projecteditor/' + project.entity_id
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
    addTrade() {
      this.activeTrade = {
        'project_id': this.id
      }
      this.tradeName = ''
      this.tradeDescription = ''
      this.tradeEditMode = 'Create'
      this.tradeDialog = true
    },    
    editTrade(trade) {
      this.activeTrade = trade
      this.tradeName = trade['name']
      this.tradeDescription = trade['description']
      this.tradeEditMode = 'Edit'
      this.tradeDialog = true
    },
    deleteTrade(id) {
      this.$store.dispatch('deleteTrade', id)
    },
    saveTrade() {      
      this.$store.dispatch('saveTrade', this.activeTrade)
      this.tradeDialog = false
    },
    addTransaction() {
      this.activeTransaction = {
        'project_id': this.id
      }
      this.transactionName = ''
      this.transactionDescription = ''
      this.transactionTrade = null
      this.transactionEditMode = 'Create'
      this.transactionDialog = true
    },
    editTransaction(transaction) {
      this.activeTransaction = transaction
      this.transactionName = transaction['name']
      this.transactionDescription = transaction['description']
      this.transactionTrade = null
      for(let i = 0; i < this.trades.length; i ++){
        let trade = this.trades[i]
        if(trade.entity_id == transaction['trade_id']){
          this.transactionTrade = trade
        }
      }
      this.transactionEditMode = 'Edit'
      this.transactionDialog = true
    },
    saveTransaction() {
      this.$store.dispatch('saveTransaction', this.activeTransaction)
      this.transactionDialog = false      
    },
    deleteTransaction(id) {
      this.$store.dispatch('deleteTransaction', id)
    },
    transactionTradeChanged(trade) {
      this.activeTransaction['trade_id'] = trade['entity_id']
    },    
    addUser() {
      this.userDialog = true
      this.activeUser = {}
      this.username = ''
      this.useremail = ''
      this.userEditMode = 'Add'
    },
    editUser(user) {
      this.userDialog = true
      this.activeUser = user
      this.username = user.name
      this.userRole = user.role
      this.userEditMode = 'Edit'
    },
    async deleteUser(user_id) {
      
      for(let i=0; i < this.activeProject.users.length; i++){
          let user = this.activeProject.users[i]
          if(user.user_id == user_id){
            this.activeProject.users.splice(i, 1)
          }
        }

      for(let i=0; i < this.activeProject.user_ids.length; i++){
          if(user_id == this.activeProject.user_ids[i]){
            this.activeProject.user_ids.splice(i, 1)
          }
        }
      
      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error']) {
          window.location = '/Projecteditor/' + project.entity_id
        }
      })
    },
    userRoleChanged() {
      
    },
    async saveUser() {
      if(this.userEditMode === 'Add'){
          let user = {
            'user_id': null,
            'name': this.username,
            'email': this.useremail,
            'role': this.userRole
          }
          this.activeProject.users.push(user)
      }
      else {
        for(let i=0; i < this.activeProject.users.length; i++){
          let user = this.activeProject.users[i]
          if((user.user_id == this.activeUser.user_id) && (user.role != this.activeUser.role)){
            this.activeProject.users[i].role = this.activeUser.role
          }
        }
      }
      
      this.userDialog = false
      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error']) {
          window.location = '/Projecteditor/' + project.entity_id
        }
      })        
    },
    onRequestInformation(){
      this.informationSubject = this.name + ' Information Request'
      this.informationDialog = true
    },
    async onSaveInformation() {
      const payload = {
        'subject': this.informationSubject,
        'project_id': this.activeProject.entity_id,
        'project_name': this.activeProject.name,
        'body': this.informationBody,
        'user_id': this.informationClient.user_id,
        'user_name': this.informationClient.name
      }

      await this.$store.dispatch('saveRequestInformation', payload).then(function (data) {
        if (!data['error']) {
          window.location = '/Projecteditor/' + data.project_id
        }
      })
      this.informationDialog = false
    },
    onRequestDocument(){
      this.documents = []
      this.documentSubject = this.name + ' Document Request'
      this.documentDialog = true
    },
    async onSaveDocument() {
      let document_list = {}
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
      }

      await this.$store.dispatch('saveRequestDocument', payload).then(function (data) {
        if (!data['error']) {
          window.location = '/Projecteditor/' + data.project_id
        }
      })
      this.documentDialog = false
    },

  },
  watch: {
    activeProject() {      
      if(this.activeProject) {
        this.name = this.activeProject.name
        this.user_id = this.activeProject.user_id
        this.description = this.activeProject.description
        if(this.activeProject.users == undefined ){
          this.activeProject.users = []
          this.users = []
        }
        else {
          this.users = this.activeProject.users
        }

        this.clients = []
        for( let i = 0; i < this.activeProject.users.length; i ++) {
          const user = this.activeProject.users[i]    
          if(user.role == 'client manager' || user.role == 'client analyst' || user.role == 'participant'){
            this.clients.push(user)
          }
        }

        if(this.activeProject.user_ids == undefined ){
          this.activeProject.user_ids = []
          this.user_ids = []
        }
        else {
          this.user_ids = this.activeProject.user_ids
        }
      }
    },
    trades() {

    },
    transactions () {

    },
    tradeName() {
      this.activeTrade['name'] = this.tradeName
    },
    tradeDescription() {
      this.activeTrade['description'] = this.tradeDescription
    },
    transactionName() {
      this.activeTransaction['name'] = this.transactionName
    },
    transactionDescription() {
      this.activeTransaction['description'] = this.transactionDescription
    },
    userRole() {
      this.activeUser.role = this.userRole
    },
    documents() {
      this.documentBody = 'Please provide the following documents:' + this.documents.join(',')

    }
  }
}
</script>