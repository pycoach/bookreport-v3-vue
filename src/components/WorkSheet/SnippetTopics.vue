<template>
  <v-list
    nav
    dense
  >
    <v-list-item-group color="primary">
      <v-list-item
        v-for="topic in currentTopics"
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
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import {mapGetters} from 'vuex';
import { EventBus } from '../EventBus.js';
export default {
  name: 'SnippetTopics',
  props: ['snippetId'],
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