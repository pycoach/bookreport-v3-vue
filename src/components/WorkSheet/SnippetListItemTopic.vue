<template>
  <v-list-item class="pa-0 px-4">
    <v-tabs
      background-color="white"
      color="primary"
      show-arrows
      grow
      center
    >
      <v-tab>All Topics</v-tab>
      <v-tab>New Topic</v-tab>
      <v-tab-item
        v-for="n in 2"
        :key="n"
      >
        Topic
      </v-tab-item>
    </v-tabs>
  </v-list-item>
</template>

<script>
  export default {
    name: 'SnippetListItemTopic'
  }
</script>

<style scoped>

</style>