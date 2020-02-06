<template>
  <v-col sm="12" md="6" lg="6">
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
        <v-btn v-show="userRole === 'provider admin'" class="ml-5 btn-primary btn-primary--small  "
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
    <v-dialog persistent v-model="topicDialog" max-width="80%">
      <v-card>
        <v-card-title class="headline">{{topicEditMode}} Topic</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-select label="Topic Type"
                        clearable
                        v-model="selectedTopicType"
                        item-text="name"
                        return-object
                        :items="topic_types"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-text-field label="Topic Name"
                            clearable
                            v-model="topicName"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-select label="Trade"
                        clearable
                        v-model="topicTrade"
                        item-text="name"
                        :items="trades"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-select label="Transaction"
                        clearable
                        v-model="topicTransaction"
                        item-text="name"
                        :items="transactions"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-select label="Document"
                        clearable
                        v-model="topicDocumentType"
                        item-text="name"
                        :items="documentTypes"
              >
              </v-select>
            </v-flex>

            <v-flex xs12 md12>
              <table class="topictype-table" style="width:100%;">
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
                <tr v-for="(item, index) in topicVariables" :key="index">
                  <td>
                    <div>{{item.name}}</div>
                  </td>
                  <td>
                    <v-text-field v-model="topicVariables[index].value" :label="item.place_holder"></v-text-field>
                  </td>
                </tr>

              </table>
            </v-flex>

            <v-flex xs12 md12>
              <v-tabs grow v-model="topicTab">
                <v-tab>Template</v-tab>
                <v-tab>Preview</v-tab>
              </v-tabs>

              <v-divider/>
              <v-tabs-items v-model="topicTab">
                <v-tab-item key="topic-1">
                  <ckeditor :editor="editor" v-model="topicTemplate" :config="editorConfig" />
                </v-tab-item>
                <v-tab-item key="topic-2">
                  <div class="tiptap-vuetify-editor__content" v-html="topicTemplate"/>
                </v-tab-item>
              </v-tabs-items>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn  color="primary" text @click="topicDialog=false">
            Cancel
          </v-btn>
          <v-btn  class="ml-5 btn-primary btn-primary--small"  text @click="saveTopic">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'Topics',
  computed: {
    ...mapGetters(['activeProject', 'topic_types', 'topics', 'trades', 'transactions']),
    ...mapState('ProjectEditor', ['userRole']),
    filteredTopics() {
      return this.topics.filter(topic => {
        return topic.name.toLowerCase().indexOf(this.topicSearch.toLowerCase()) > -1
      })
    }
  },
  data() {
    return {
      topicName: '',
      topicTrade: '',
      topicTransaction: '',
      topicDocumentType: '',
      topicTemplate: '',
      topicVariables: [],
      topicSnippetsIds: [],
      selectedTopicType: {},
      topicDialog: false,
      topicEditMode: 'Create',
      topicSearch:'',
      activeTopic: {},
      topicTab: null,
      documentTypes: ["Fund - Financial","Fund - Memo", "Investment - Financial", "Investment - Legal",
        "Investment - Memo", "Investment - Value Model"],
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  methods: {
    addTopic() {
      this.topicEditMode = 'Create';
      this.topicDialog = true;
    
      this.activeTopic = {
        'project_id': this.activeProject.entity_id,
        'snippet_ids': []
      };
      this.topicName = '';
      this.topicDescription = '';
      this.topicVariables = {}
    },
  
    editTopic(topic) {
      this.topicEditMode = 'Edit';
      this.topicDialog = true;
    
      Object.assign(this.activeTopic, topic);
      this.topicName = topic['name'];
      this.topicTrade = topic['trade'];
      this.topicTransaction = topic['transaction'];
      this.topicDocumentType = topic['document'];
      this.topicTemplate = topic['template'];
      this.topicSnippetsIds = topic['snippet_ids'];
    
    
      for(let i = 0; i < this.topic_types.length; i++){
        if (topic['topic_type_id'] === this.topic_types[i].entity_id){
          Object.assign(this.selectedTopicType, this.topic_types[i])
        
        }
      }
    
      this.topicVariables = topic['variables']
    },
  
    deleteTopic(id) {
      this.$store.dispatch('deleteTopic', id)
    },
  
    saveTopic() {
      let topic = Object.assign({}, this.activeTopic);
      topic['topic_type_id'] = this.selectedTopicType.entity_id;
      topic['name'] = this.topicName;
      topic['trade'] = this.topicTrade;
      topic['transaction'] = this.topicTransaction;
      topic['document'] = this.topicDocumentType;
      topic['template'] = this.topicTemplate;
    
      let variables = [];
      for(let i = 0;i < this.topicVariables.length; i++){
        let variable = {
          'name': this.topicVariables[i].name,
          'data_type': this.topicVariables[i].data_type,
          'value': this.topicVariables[i].value,
        };
        variables.push(variable)
      }
      topic['variables'] = variables;
    
      this.$store.dispatch('saveTopic', topic).then(() => {
        this.topicDialog = false;
      })
    },
  },
  watch: {
    selectedTopicType() {
      if(this.selectedTopicType){
        this.topicName = this.selectedTopicType.name + ' for ' + this.topicTransaction;
        this.topicTemplate = this.selectedTopicType.template;
      
        this.topicVariables = [];
        for(let i = 0; i < this.selectedTopicType.variables.length; i++){
          let variable_type = this.selectedTopicType.variables[i];
          let variable = {
            'name': variable_type.name,
            'data_type':variable_type.data_type,
            'place_holder': 'ex: ' + variable_type.example_value,
            'value': ''
          };
          this.topicVariables.push(variable)
        }
      }
    },
    topicTransaction() {
      this.topicName = this.selectedTopicType.name + ' for ' + this.topicTransaction
    }
  }
}
</script>

<style scoped>

</style>