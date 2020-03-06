<template>
  <v-list
    nav
    dense
  >
    <v-list-item-group
      v-if="topics.length"
      color="primary"
    >
      <topic-item
        v-for="topic in topics"
        :key="topic.entity_id + String(snippetId)"
        :topic="topic"
        :snippet-id="snippetId"
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
import TopicItem from './TopicItem';
export default {
  name: 'AllTopics',
  props: ['snippetId'],
  components: {
    TopicItem
  },
  computed: {
    ...mapGetters(['topics'])
  }
}
</script>

<style scoped>

</style>