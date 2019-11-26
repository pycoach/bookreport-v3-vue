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
              <v-text-field label="segment_id"
                v-model="segment_id"
                @input="segment_idMaintainer"
                maxlength="35">
              </v-text-field>
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
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      segment_id: null,
      
      
    }
  },
  mounted() {
    if (this.id !== 'new') {
      this.editMode = 'Edit'
      this.$store.commit('setActiveProject', {})
      this.$store.dispatch('getProject', this.id)
    } else {
      this.$store.commit('setActiveProject', {})
    }
  },
  computed: {
    ...mapGetters(['activeProject', 'user']),
  },
  methods: {
    saveProject() {
      this.setValues(this, this.activeProject)
      this.$store.dispatch('saveProject', this.activeProject)
    },
    
    
    
    
    
    segment_idMaintainer() {
      if (this.segment_id.length == 8 ||
        this.segment_id.length == 13 ||
        this.segment_id.length == 18 ||
        this.segment_id.length == 23) {
          this.segment_id = this.segment_id + '-'
        }
    },
    
    
    
    setValues(source, destination) {
      destination['version'] = source['version']
      if (source['id'] !== 'new') {
        destination['entity_id'] = source['id']
      }
      
      
      destination['name'] = source['name']
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      destination['segment_id'] = source['segment_id']
      let id = destination['segment_id']
      if (id) {
        for (let i = 0; i < 5; i++) {
          id = id.replace('-', '')
        }
        destination['segment_id'] = id
      }
      
      
    }
  },
  watch: {
    activeProject() {
      if(this.activeProject) {
        
        
        this.name = this.activeProject.name
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        this.segment_id = this.activeProject.segment_id
        
        
      }
    }
  }
}
</script>