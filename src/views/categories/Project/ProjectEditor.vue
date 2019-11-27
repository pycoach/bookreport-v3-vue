<template>
  <v-layout row wrap>
    <v-flex xs12 md4 class="pa-5">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-card-title
            class="headline">
            {{ editMode }} Project
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
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="$router.push('/Project')">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveProject()">
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
  name: 'ProjectEditor',
  props: ['id'],
  data() {
    return {
      editMode: 'Create',    
      name: '',
      user_id: null,
      description: '',
    }
  },
  mounted() {
    this.user_id = this.user.entity_id
    if (this.id !== 'new') {
      this.editMode = 'Edit'
      this.$store.commit('setActiveProject', {user_id: this.user_id})
      this.$store.dispatch('getProject', this.id)
    } else {
      this.$store.commit('setActiveProject', {user_id: this.user_id})
    }
  },
  computed: {
    ...mapGetters(['activeProject', 'user']),
  },
  methods: {
    saveProject() {      
      this.setValues(this, this.activeProject)
      console.log(this.activeProject)
      this.$store.dispatch('saveProject', this.activeProject)
    },
    setValues(source, destination) {      
      destination['version'] = source['version']
      if (source['id'] !== 'new') {
        destination['entity_id'] = source['id']
      }     
      destination['name'] = source['name']
      destination['user_id'] = source['user_id']
      destination['description'] = source['description']
    }
  },
  watch: {
    activeProject() {
      if(this.activeProject) {   
        this.name = this.activeProject.name
        this.user_id = this.activeProject.user_id
      }
    }
  }
}
</script>