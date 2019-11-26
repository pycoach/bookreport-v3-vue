
<template>
  <div class='pa-5'>
    <v-hover>
      <v-card max-width="600" slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`">
        <v-toolbar color="primary" dark>
          <v-card-title>Project</v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="$router.push('/Projecteditor/new')">add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list two-line>
          <template v-for="(project, index) in projects">
            <v-list-item
              :key="project.entity_id"
              @click="$router.push('/Projecteditor/' + project.entity_id)">
              <v-list-item-content>
                <v-list-item-title v-html="project.name"></v-list-item-title>
              </v-list-item-content>
              <v-btn icon @click.stop="apiDelete(project.entity_id)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-item>
            <v-divider
              v-if="index < projects.length - 1">
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
  name: 'Project',
  computed: {
    ...mapGetters(['projects'])
  },
  data() {
    return {}
  },
  
  created() {
    this.$store.dispatch('loadProjects');
  },
  
  methods: {
    apiDelete(id) {
      this.$store.dispatch('deleteProject', id)
    },
  }
}
</script>
