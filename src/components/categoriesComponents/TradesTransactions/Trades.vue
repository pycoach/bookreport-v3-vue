<template>
  <v-col sm="12" md="6" lg="6">
    <v-card>
      <v-toolbar style="border: none">
        <v-card-title>Trades
          <div class="vertical-divider vertical-divider--small" />
          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="" />
          <v-text-field
            class="card-search"
            label="Find Projects"
            placeholder="Find Trades"
            v-model="tradeSearch"
          >
          </v-text-field>
        </v-card-title>
        <v-spacer />
        <v-btn  
          class="ml-5 btn-primary btn-primary--small"
          @click="addTrade"
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
          <tbody >
          <tr v-for="(trade, index) in filteredTrades"  @click="editTrade(trade)" :key="trade.entity_id" >
            <td style="width: 40%">{{ trade.name }}</td>
            <td style="width: 60%">{{ trade.description && trade.description.length > 25 ? trade.description.slice(0, 25) + '...' : trade.description || '' }}</td>
            <td>
              <v-btn icon @click.stop="deleteTrade(trade.entity_id)">
                <img class="close-icon" src="../../../assets/icons/trash.svg" alt="" />
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    
    <!--Dialog-->
    <v-dialog persistent v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{tradeEditMode}} Trade</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field 
                label="Name"
                clearable
                v-model="tradeName"
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea 
                label="Description"
                v-model="tradeDescription"
                outlined
                auto-grow
                rows="4"
                row-height="30" 
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog=false">
            Cancel
          </v-btn>
          <v-btn 
            class="ml-5 btn-primary btn-primary--small" 
            text 
            @click="saveTrade"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'Trades',
  computed: {
    ...mapGetters(['activeProject', 'trades']),
    filteredTrades() {
      return this.trades.filter(trade => {
        return trade.name.toLowerCase().indexOf(this.tradeSearch.toLowerCase()) > -1
      })
    }
  },
  data() {
    return {
      tradeName: '',
      tradeDescription: '',
      dialog: false,
      tradeEditMode: 'Create',
      tradeSearch: '',
      activeTrade: {},
      isLoading: false
    }
  },
  methods: {
    addTrade() {
      this.activeTrade = {
        'project_id': this.activeProject.entity_id
      };
      this.tradeName = '';
      this.tradeDescription = '';
      this.tradeEditMode = 'Create';
      this.dialog = true
    },
    editTrade(trade) {
      this.activeTrade = trade;
      this.tradeName = trade['name'];
      this.tradeDescription = trade['description'];
      this.tradeEditMode = 'Edit';
      this.dialog = true
    },
    deleteTrade(id) {
      this.$store.dispatch('deleteTrade', id)
    },
    async saveTrade() {
      const self = this;
      self.isLoading = true;
      await this.$store.dispatch('saveTrade', this.activeTrade).then(function (trade) {
        self.isLoading = false;
        self.dialog = false;
      })
    }
  },
  watch: {
    tradeName() {
      this.activeTrade['name'] = this.tradeName
    },
    tradeDescription() {
      this.activeTrade['description'] = this.tradeDescription
    }
  }
}
</script>

<style scoped>

</style>