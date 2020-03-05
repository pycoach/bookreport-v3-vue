<template>
  <v-list-item class="pa-0 pa-4">
    <v-tabs
      v-model="activeTab"
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
        <topic-list-snippet :snippet-id="snippetId" />
      </v-tab-item>
      <v-tab-item key="2">
        <topic-list-all :snippet-id="snippetId" />
      </v-tab-item>
      <v-tab-item key="3">
        <v-list class="text-center">
          <v-btn
            class="my-3"
            text
            small
            color="primary"
            @click="showNewTopicDialog"
          >
            Add new Topic
          </v-btn>
        </v-list>
      </v-tab-item>
    </v-tabs>
    <add-topic 
      ref="addTopicDialog" 
      @newTopicIsAdded="navigateToAllTopics"
    />
  </v-list-item>
</template>

<script>
import TopicListSnippet from './TopicListSnippet';
import TopicListAll from './TopicListAll';
export default {
  name: 'SnippetListItemTopic',
  props: ['snippetId'],
  components: {
    TopicListSnippet,
    TopicListAll,
    'add-topic': () => import('../../../categoriesComponents/Topic/AddTopic')
  },
  data: () => ({
    activeTab: 0
  }),
  methods: {
    showNewTopicDialog () {
      this.$refs.addTopicDialog.addTopic()
    },
    navigateToAllTopics () {
      this.activeTab = 1
    }
  }
}
</script>

<style scoped>

</style>