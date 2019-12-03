<template>
  <v-layout row wrap>
    <v-flex xs12 md4 class="pa-5">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-card-title
            class="headline">
            {{ editMode }} Trade
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
              <v-text-field label="Description"
                clearable
                v-model="description">
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="$router.push('/Trade')">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveTrade()">
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
  name: 'TradeEditor',
  props: ['id'],
  data() {
    return {
      editMode: 'Create',  
      name: '',
      project_id: null,
      description: '',
    }
  },
  mounted() {
    if (this.id !== 'new') {
      this.editMode = 'Edit'
      this.$store.commit('setActiveTrade', {})
      this.$store.dispatch('getTrade', this.id)
    } else {
      this.$store.commit('setActiveTrade', {})
    }
  },
  computed: {
    ...mapGetters(['activeTrade', 'user']),
  },
  methods: {
    saveTrade() {
      this.setValues(this, this.activeTrade)
      this.$store.dispatch('saveTrade', this.activeTrade)
    },
    project_idMaintainer() {
      if (this.project_id.length == 8 ||
        this.project_id.length == 13 ||
        this.project_id.length == 18 ||
        this.project_id.length == 23) {
          this.project_id = this.project_id + '-'
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
      destination['description'] = source['description']
    }
  },
  watch: {
    activeTrade() {
      if(this.activeTrade) {
        this.name = this.activeTrade.name
        this.project_id = this.activeTrade.project_id
        this.description = this.activeTrade.description
      }
    }
  }
}
</script>