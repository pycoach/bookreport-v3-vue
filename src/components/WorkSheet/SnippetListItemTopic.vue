<template>
  <v-list-item class="pa-0 pa-4">
    <v-tabs
      background-color="white"
      color="primary"
      show-arrows
      grow
      center
    >
      <v-tab>Snippet Topics</v-tab>
      <v-tab>All Topics</v-tab>
      <v-tab>New Topic</v-tab>
      <v-tab-item key="1">
        <snippet-topics :snippet-id="snippetId" />
      </v-tab-item>
      <v-tab-item key="2">
        <all-topics :snippet-id="snippetId" />
      </v-tab-item>
      <v-tab-item key="3">
        <v-list
                nav
                dense
        >
          Not Found
        </v-list>
      </v-tab-item>
    </v-tabs>
  </v-list-item>
</template>

<script>
import SnippetTopics from './SnippetTopics';
import AllTopics from './AllTopics';
export default {
  name: 'SnippetListItemTopic',
  props: ['snippetId'],
  components: {
    SnippetTopics,
    AllTopics
  }
}
</script>

<style scoped>

</style>