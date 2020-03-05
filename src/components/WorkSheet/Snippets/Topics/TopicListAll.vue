<template>
  <v-list
    nav
    dense
  >
    <v-list-item-group color="primary">
      <topic-item
        v-for="topic in topics"
        :key="topic.entity_id + String(snippetId)"
        :topic="topic"
        :snippet-id="snippetId"
      />
    </v-list-item-group>
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