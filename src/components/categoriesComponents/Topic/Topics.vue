<template>
  <v-col sm="12" md="6" lg="6" id="topic">
    <v-card>
      <v-toolbar style="border: none">
        <v-card-title>Topics
          <div class="vertical-divider vertical-divider--small"></div>
          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="">
          <v-text-field
            class="card-search"
            label="Find Topics"
            placeholder="Find Topics"
            v-model="topicSearch"
          >
          </v-text-field>
        </v-card-title>
        <v-btn 
          v-show="userRole === 'provider admin'" 
          :disabled="topic_types.length === 0"
          class="ml-5 btn-primary btn-primary--small"
          @click="addTopic">
          + Add
        </v-btn>
      </v-toolbar>
      <v-simple-table>
        <template>
          <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Action</th>
          </tr>
          </thead>
          <tbody v-if="userRole === 'provider admin'">
          <tr v-for="(topic, index) in filteredTopics" @click="editTopic(topic)" :key="topic.entity_id">
            <td style="width: 100%">{{ topic.name }}</td>
            <td>
              <v-btn icon @click.stop="deleteTopic(topic.entity_id)">
                <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
              </v-btn>
            </td>
          </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="(topic, index) in filteredTopics" :key="topic.entity_id">
              <td style="width: 100%">{{ topic.name }}</td>
            </tr>
          </tbody>

        </template>
      </v-simple-table>
    </v-card>
    <!--Dialog-->
    <add-topic ref="addTopicDialog" />
  </v-col>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
export default {
  name: 'Topics',
  components: {
    'add-topic': () => import('./AddTopic')
  },
  computed: {
    ...mapGetters(['topic_types', 'topics']),
    ...mapState('ProjectEditor', ['userRole']),
    filteredTopics() {
      return this.topics.filter(topic => {
        return topic.name.toLowerCase().indexOf(this.topicSearch.toLowerCase()) > -1
      })
    }
  },
  data() {
    return {
      topicSearch:''
    }
  },
  methods: {
    addTopic() {
      this.$refs.addTopicDialog.addTopic()
    },
    editTopic(topic) {
      this.$refs.addTopicDialog.editTopic(topic)
    },
    deleteTopic(id) {
      this.$refs.addTopicDialog.deleteTopic(id)
    },
    cancelTopic() {
      this.$refs.addTopicDialog.cancelTopic()
    },
  }
}
</script>

<style scoped>

</style>