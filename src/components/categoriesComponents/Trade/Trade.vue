
<template>
  <div class='pa-5'>
    <v-dialog persistent v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{editMode}} Trade</v-card-title>
        <v-container grid-list-xl fluid pt-0>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Name"
                clearable
                v-model="name">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-text-field label="project_id"
                v-model="project_id"
                @input="project_idMaintainer"
                maxlength="35">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-text-field label="Description"
                clearable
                v-model="description">
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog=false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-hover>
      <v-card max-width="600" slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`">
        <v-toolbar color="primary" dark>
          <v-card-title>Trade</v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="add">add</v-icon>
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
              <v-btn icon @click.stop="apiDelete(trade.entity_id)">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Trade',
  computed: {
    ...mapGetters(['trades', 'projects'])
  },
  data() {
    return {
      name: '',
      project_id: null,
      description: '',
      dialog: false,
      editMode: 'Create',
      activeTrade: {},
      name: null
    }
  },
  
  created() {
    this.$store.dispatch('loadTrades');
    this.$store.dispatch('loadProjects');
  },
  
  methods: {
    add() {
      this.activeTrade = {}
      this.setTradeValues(this.activeTrade, this)
      this.editMode = 'Create'
      this.dialog = true
    },
    save() {
      this.setTradeValues(this, this.activeTrade)
      this.$store.dispatch('saveTrade', this.activeTrade)
      this.dialog = false
    },
    editTrade(trade) {
      this.activeTrade = trade
      this.setTradeValues(this.activeTrade, this)
      this.editMode = 'Edit'
      this.dialog = true
    },
    apiDelete(id) {
      this.$store.dispatch('deleteTrade', id)
    },
    project_idMaintainer() {
      if (this.project_id.length == 8 ||
        this.project_id.length == 13 ||
        this.project_id.length == 18 ||
        this.project_id.length == 23) {
          this.project_id = this.project_id + '-'
        }
    },
    setTradeValues(source, destination) {
      destination['version'] = source['version']
      destination['entity_id'] = source['entity_id']   
      destination['name'] = source['name']
      destination['project_id'] = source['project_id']
      let id = destination['project_id']
      if (id) {
        for (let i = 0; i < 5; i++) {
          id = id.replace('-', '')
        }
        destination['project_id'] = id
      }
      destination['description'] = source['description']
    }
  }
}
</script>
