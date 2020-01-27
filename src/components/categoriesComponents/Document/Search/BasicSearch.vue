<template>
  <v-layout row wrap class="pa-2">
    <v-flex xs12 sm12>
      <v-text-field
        label="Search..."
        prepend-icon="search"
        @input="onSearch"
        v-model="searchQuery" 
      />
    </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'BasicSearch',
  data () {
    return {
      searchQuery: null,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['activeProject', 'user', 'searchOptions'])
  },
  methods: {
    onSearch(value) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('loadDocuments', { 
          project_id: this.activeProject.entity_id, 
          basic: value 
        })
      }, 300);
    }
  }
}
</script>

<style scoped>

</style>