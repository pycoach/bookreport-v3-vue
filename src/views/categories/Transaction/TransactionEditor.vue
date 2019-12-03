<template>
  <v-layout row wrap>
    <v-flex xs12 md4 class="pa-5">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-card-title
            class="headline">
            {{ editMode }} Transaction
          </v-card-title>
        </v-toolbar>
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
              <v-text-field label="trade_id"
                v-model="trade_id"
                @input="trade_idMaintainer"
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
          <v-btn color="red darken-1" text @click="$router.push('/Transaction')">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveTransaction()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TransactionEditor',
  props: ['id'],
  data() {
    return {
      editMode: 'Create',
      name: '',
      project_id: null,
      trade_id: null,
      description: '',
    }
  },
  mounted() {
    if (this.id !== 'new') {
      this.editMode = 'Edit'
      this.$store.commit('setActiveTransaction', {})
      this.$store.dispatch('getTransaction', this.id)
    } else {
      this.$store.commit('setActiveTransaction', {})
    }
  },
  computed: {
    ...mapGetters(['activeTransaction', 'user']),
  },
  methods: {
    saveTransaction() {
      this.setValues(this, this.activeTransaction)
      this.$store.dispatch('saveTransaction', this.activeTransaction)
    },
    project_idMaintainer() {
      if (this.project_id.length == 8 ||
        this.project_id.length == 13 ||
        this.project_id.length == 18 ||
        this.project_id.length == 23) {
          this.project_id = this.project_id + '-'
        }
    },
    trade_idMaintainer() {
      if (this.trade_id.length == 8 ||
        this.trade_id.length == 13 ||
        this.trade_id.length == 18 ||
        this.trade_id.length == 23) {
          this.trade_id = this.trade_id + '-'
        }
    },
    setValues(source, destination) {
      destination['version'] = source['version']
      if (source['id'] !== 'new') {
        destination['entity_id'] = source['id']
      }
      destination['name'] = source['name']
      destination['project_id'] = source['project_id']
      let id = destination['project_id']
      if (id) {
        for (let i = 0; i < 5; i++) {
          id = id.replace('-', '')
        }
        destination['project_id'] = id
      }
      destination['trade_id'] = source['trade_id']
      id = destination['trade_id']
      if (id) {
        for (let i = 0; i < 5; i++) {
          id = id.replace('-', '')
        }
        destination['trade_id'] = id
      }
      destination['description'] = source['description']
    }
  },
  watch: {
    activeTransaction() {
      if(this.activeTransaction) {
        this.name = this.activeTransaction.name
        this.project_id = this.activeTransaction.project_id
        this.trade_id = this.activeTransaction.trade_id
        this.description = this.activeTransaction.description
      }
    }
  }
}
</script>