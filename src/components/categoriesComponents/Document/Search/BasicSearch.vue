<template>
  <v-form ref="form" @submit.prevent="true">
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
  </v-form>
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
    ...mapGetters(['activeProject', 'user']),
    ...mapGetters('ProjectDocuments', ['searchOptions'])
  },
  beforeDestroy() {
    this.resetForm()
  },
  methods: {
    onSearch(value) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('ProjectDocuments/loadDocuments', { 
          project_id: this.activeProject.entity_id, 
          basic: value 
        })
      }, 500);
    },
    resetForm () {
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped>

</style>