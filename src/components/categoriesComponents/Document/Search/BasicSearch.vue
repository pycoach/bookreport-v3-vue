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
export default {
  name: 'BasicSearch',
  data () {
    return {
      searchQuery: null,
    }
  },
  methods: {
    onSearch(e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

</style>