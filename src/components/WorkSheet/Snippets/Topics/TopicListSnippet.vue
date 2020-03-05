<template>
  <v-list
    nav
    dense
  >
    <v-list-item-group 
      v-if="currentTopics.length" 
      color="primary"
    >
      <topic-item
        v-for="topic in currentTopics"
        :key="topic.entity_id + String(snippetId)"
        :topic="topic"
        :snippet-id="snippetId"
        :deleteonly="true"
      />
    </v-list-item-group>
    <v-alert
      v-else
      type="warning"
      color="purple"
      text
      dense
      class="mt-4"
    >
      Topics Not found
    </v-alert>
  </v-list>
</template>

<script>
import {mapGetters} from 'vuex';
import { EventBus } from '../../../EventBus.js';
import TopicItem from './TopicItem';
export default {
  name: 'SnippetTopics',
  props: ['snippetId'],
  components: {
    TopicItem
  },
  computed: {
    ...mapGetters(['topics']),
    currentTopics () {
      return this.topics.filter(topic => {
        return topic.snippet_ids.includes(this.snippetId)
      }) 
    }
  },
  methods: {
    viewTopic (topic) {
      EventBus.$emit('handleSnippetTopicView', topic)
    }
  }
}
</script>

<style scoped>

</style>