<template>
  <v-dialog
    v-model="show"
    width="800"
  >
    <v-card>
      <v-card-title class="headline">{{topic.name}}</v-card-title>
      <v-container grid-list-xl fluid>
        <v-layout row wrap>
          <v-flex xs12 md6>
            <div>
              <strong>Topic Type</strong>
            </div>
            <v-text-field 
              :value="topicTypeName && topicTypeName.name"
              readonly
              disabled
              hide-details 
            />
          </v-flex>
          <v-flex xs12 md6>
            <div>
              <strong>Topic Name</strong>
            </div>
            <v-text-field 
              :value="topic.name"
              readonly
              disabled
              hide-details 
            />
          </v-flex>
          <v-flex xs12 md6>
            <div>
              <strong>Trade</strong>
            </div>
            <v-text-field 
              :value="topic.trade"
              readonly
              disabled
              hide-details 
            />
          </v-flex>
          <v-flex xs12 md6>
            <div>
              <strong>Transaction</strong>
            </div>
            <v-text-field 
              :value="topic.transaction"
              readonly
              disabled
              hide-details 
            />
          </v-flex>
          <v-flex xs12 md6>
            <div>
              <strong>Document</strong>
            </div>
            <v-text-field 
              :value="topic.document"
              readonly
              disabled
              hide-details 
            />
          </v-flex>
          <v-flex xs12 md6>
            <div>
              <strong>Variables</strong>
            </div>
            <table class="topictype-table mt-4" style="width:100%;">
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
              <tr v-for="(item, index) in topic.variables" :key="index">
                <td>
                  <p class="ma-3">{{item.name}}</p>
                </td>
                <td>
                  <p class="ma-3">{{topic.variables[index].value}}</p>
                </td>
              </tr>
            </table>
          </v-flex>
          <v-flex xs12>
            <div>
              <strong>Template</strong>
            </div>
            <div v-html="topic.template" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { EventBus } from '../../../EventBus.js';
export default {
  name: 'ViewTopic',
  data: () => ({
    show: false,
    topic: {}
  }),
  computed: {
    ...mapGetters(['topic_types']),
    topicTypeName () {
      if (this.topic_types) {
        return this.topic_types.find((type) => type.entity_id === this.topic.topic_type_id)
      }
    }
  },
  mounted () {
    EventBus.$on('handleSnippetTopicView', ((topic) => {
      this.show = !this.show;
      if (!topic) return;
      this.topic = topic
    }))
  }
}
</script>

<style scoped>

</style>