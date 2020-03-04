<template>
  <v-list
    nav
    dense
  >
    <v-list-item-group color="primary">
      <v-list-item
        v-for="topic in topics"
        :key="topic.entity_id + String(snippetId)"
        :ripple="false"
        inactive
      >
        <v-list-item-content>
          <v-list-item-title v-text="topic.name" />
        </v-list-item-content>
        <v-list-item-action class="my-0">
          <v-btn icon small @click="viewTopic(topic)">
            <v-icon size="medium" color="lighten-1">remove_red_eye</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action class="my-0 ml-1">
          <v-btn 
            icon 
            small 
            :disabled="isTopicAdded(topic.snippet_ids)"
            @click="setSnippetTopic(topic.entity_id)"
          >
            <v-icon v-if="isTopicAdded(topic.snippet_ids)" size="medium" color="lighten-1">done</v-icon>
            <v-icon v-else size="medium" color="lighten-1">add</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import {mapGetters} from 'vuex';
import { EventBus } from '../EventBus.js';
export default {
  name: 'AllTopics',
  props: ['snippetId'],
  computed: {
    ...mapGetters(['topics'])
  },
  methods: {
    setSnippetTopic (entity_id) {
      const index = this.topics.findIndex((item) => item.entity_id === entity_id);
      const currentTopic = this.topics[index];
      if (currentTopic.snippet_ids.includes(this.snippetId)) return;
      currentTopic.snippet_ids.push(this.snippetId);
      this.$store.dispatch('saveTopic', currentTopic)
    },
    viewTopic (topic) {
      EventBus.$emit('handleSnippetTopicView', topic)
    },
    isTopicAdded (snippet_ids) {
      return snippet_ids.includes(this.snippetId)
    }
  }
}
</script>

<style scoped>

</style>