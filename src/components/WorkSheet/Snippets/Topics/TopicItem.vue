<template>
  <v-list-item
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
        v-if="!deleteonly"
        icon
        small
        class="v-size--small"
        :disabled="isTopicAdded(topic.snippet_ids)"
        :loading="isProcessing"
        @click="setSnippetTopic"
      >
        <v-icon size="medium" color="primary">
          <template v-if="isTopicAdded(topic.snippet_ids)">check_circle</template>
          <template v-else>add_circle</template>
        </v-icon>
      </v-btn>
      <v-btn
        v-else
        icon
        small
        :loading="isProcessing"
        @click="unSetSnippetTopic"
      >
        <v-icon size="medium" color="error">remove_circle</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import {EventBus} from "../../../EventBus";
export default {
  name: 'TopicItem',
  props: ['topic', 'snippetId', 'deleteonly'],
  data: () => ({
    isProcessing: false
  }),
  methods: {
    setSnippetTopic () {
      this.isProcessing = true;
      if (this.topic.snippet_ids.includes(this.snippetId)) return;
      const topicCloned = JSON.parse(JSON.stringify(this.topic));
      topicCloned.snippet_ids.push(this.snippetId);
      this.$store.dispatch('saveTopic', topicCloned).finally(() => {
        this.isProcessing = false
      })
    },
    unSetSnippetTopic () {
      this.isProcessing = true;
      const topicCloned = JSON.parse(JSON.stringify(this.topic));
      for (let i = 0; i <= topicCloned.snippet_ids.length; i++ ) {
        if (topicCloned.snippet_ids[i] === this.snippetId) {
          topicCloned.snippet_ids.splice(i, 1)
        }
      }
      this.$store.dispatch('saveTopic', topicCloned).finally(() => {
        this.isProcessing = false
      })
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