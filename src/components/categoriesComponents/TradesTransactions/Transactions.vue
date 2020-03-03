<template>
  <v-col sm="12" md="6" lg="6">
    <v-card>
      <v-toolbar style="border: none">
        <v-card-title>Transactions
          <div class="vertical-divider vertical-divider--small" />
          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="">
          <v-text-field
            class="card-search"
            label="Find Projects"
            placeholder="Find Transactions"
            v-model="transactionSearch"
          />
        </v-card-title>
        <v-btn  
          class="ml-5 btn-primary btn-primary--small  "
          @click="addTransaction"
        >
          + Add
        </v-btn>
      </v-toolbar>
      <v-simple-table>
        <template>
          <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Description</th>
            <th class="text-left">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(transaction, index) in filteredTransactions"  @click="editTransaction(transaction)" :key="transaction.entity_id" >
            <td style="width: 40%">{{ transaction.name }}</td>
            <td v-if="!transaction.description" style="width: 60%"></td>
            <td v-else style="width: 60%">{{ transaction.description.length > 25 ? transaction.description.slice(0, 25) + '...' : transaction.description }}</td>
            <td>
              <v-btn icon @click.stop="deleteTransaction(transaction.entity_id)">
                <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!-- <v-list two-line>
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
      </v-list> -->
    </v-card>
    
    <!--Dialog-->
    <v-dialog persistent v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{transactionEditMode}} Transaction</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field 
                label="Name*"
                v-model="transactionName" 
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea 
                label="Description"
                v-model="transactionDescription"
                outlined
                auto-grow
                rows="4"
                row-height="30"
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="trades"
                item-text="name"
                v-model="transactionTrade"
                label="Trade"
                return-object
                @change="transactionTradeChanged"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeTransaction">
            CANCEL
          </v-btn>
          <v-btn 
            class="ml-5 btn-primary btn-primary--small" 
            text 
            @click="saveTransaction"
            :loading="isLoading"
            :disabled="isLoading || !canSave()"
          >
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Transactions',
  computed: {
    ...mapGetters(['activeProject', 'transactions', 'trades']),
    filteredTransactions() {
      return this.transactions.filter(transaction => {
        return transaction.name.toLowerCase().indexOf(this.transactionSearch.toLowerCase()) > -1
      })
    }
  },
  data() {
    return {
      transactionName: '',
      transactionDescription: '',
      transactionTrade: null,
      dialog: false,
      transactionEditMode: 'Create',
      transactionSearch: '',
      activeTransaction: {},
      isLoading: false
    }
  },
  methods: {
    canSave() {
      return /^[^.\s]/.test(this.transactionName)
    },
    addTransaction() {
      this.activeTransaction = {
        'project_id': this.activeProject.entity_id
      };
      this.transactionName = '';
      this.transactionDescription = '';
      this.transactionTrade = null;
      this.transactionEditMode = 'Create';
      this.dialog = true
    },
    editTransaction(transaction) {
      this.activeTransaction = Object.assign({}, transaction)
      this.transactionName = transaction['name'];
      this.transactionDescription = transaction['description'];
      this.transactionTrade = null;
      for(let i = 0; i < this.trades.length; i ++){
        let trade = this.trades[i];
        if(trade.entity_id === transaction['trade_id']){
          this.transactionTrade = trade
        }
      }
      this.transactionEditMode = 'Edit';
      this.dialog = true
    },
    async saveTransaction() {
      const self = this;
      self.isLoading = true;
      await this.$store.dispatch('saveTransaction', this.activeTransaction).then(function (transaction) {
        self.isLoading = false;
        self.dialog = false;
      })
    },
    deleteTransaction(id) {
      this.$store.dispatch('deleteTransaction', id)
    },
    closeTransaction() {
      this.transactionName = ''
      this.transactionDescription = ''
      this.activeTransaction = {}
      this.dialog = false
    },
    transactionTradeChanged(trade) {
      this.activeTransaction['trade_id'] = trade['entity_id']
    },
  },
  watch: {
    transactionName () {
      this.activeTransaction['name'] = this.transactionName
    },
    transactionDescription () {
      this.activeTransaction['description'] = this.transactionDescription
    }
  }
}
</script>

<style scoped>

</style>