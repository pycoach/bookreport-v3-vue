<template>
  <v-dialog persistent v-model="topicDialog" max-width="80%" class="dialog-window">
    <v-card>
      <v-card-title class="headline">{{topicEditMode}} Topic</v-card-title>
      <v-container grid-list-xl fluid>
        <v-layout row wrap v-if="topic_types.length">
          <v-flex xs12 md6 py-0>
            <v-select 
              label="Topic Type"
              v-model="selectedTopicType"
              item-text="name"
              return-object
              :items="topic_types"
              @change="topicTypeChanged"
            />
          </v-flex>
          <v-flex xs12 md6 py-0>
            <v-text-field 
              label="Topic Name"
              v-model="topicName"
            />
          </v-flex>
          <v-flex xs12 md6 py-0>
            <v-select 
              label="Trade"
              v-model="topicTrade"
              item-text="name"
              :items="trades"
            />
          </v-flex>
          <v-flex xs12 md6 py-0>
            <v-select 
              label="Transaction"
              v-model="topicTransaction"
              item-text="name"
              :items="transactions"
            />
          </v-flex>
          <v-flex xs12 md6 py-0>
            <v-select 
              label="Document"
              v-model="topicDocumentType"
              item-text="name"
              :items="documentTypes"
            />
          </v-flex>
          <v-flex xs12 md6 py-0>
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
                  <v-text-field 
                    v-model="topicVariables[index].value" :label="item.place_holder"
                    @change="changeTopicVariables" 
                  />
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
                <div class="tiptap-vuetify-editor__content" v-html="topicTemplatePreview"/>
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancelTopic">
          Cancel
        </v-btn>
        <v-btn
          class="ml-5 btn-primary btn-primary--small"
          text
          :disabled="!canSave() || saving"
          :loading="saving"
          @click="saveTopic"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from '@ckeditor/ckeditor5-vue'
export default {
  name: 'AddTopic',
  components: {
    'ckeditor': CKEditor.component
  },
  computed: {
    ...mapGetters(['activeProject', 'topic_types', 'trades', 'transactions'])
  },
  data() {
    return {
      topicName: '',
      topicTrade: '',
      topicTransaction: '',
      topicDocumentType: '',
      topicTemplate: '',
      topicTemplatePreview: '',
      topicVariables: [],
      topicSnippetsIds: [],
      selectedTopicType: {},
      topicDialog: false,
      topicEditMode: 'Create',
      activeTopic: {},
      topicTab: null,
      saving: false,
      documentTypes: ["Fund - Financial","Fund - Memo", "Investment - Financial", "Investment - Legal",
        "Investment - Memo", "Investment - Value Model"],
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  created () {
    if (!this.activeProject.entity_id) {
      const project_id = this.$route.params.project_id
      this.$store.dispatch('getProject', project_id)
      this.$store.dispatch('loadTrades', project_id)
      this.$store.dispatch('loadTransactions', project_id)
      this.$store.dispatch('loadTopicTypes', project_id)
      this.$store.dispatch('loadTopics', project_id)
    }
  },
  methods: {
    canSave() {
      return /^[^.\s]/.test(this.topicName)
    },
    addTopic() {
      this.topicEditMode = 'Create';
      this.topicDialog = true;
      
      let newTopic = {
        'project_id': this.activeProject && this.activeProject.entity_id,
        'snippet_ids': []
      };
      
      Object.assign(this.activeTopic, newTopic);
      
      this.topicName = '';
      this.topicTrade = '';
      this.topicTransaction = '';
      this.topicDocumentType = '';
      this.topicTemplate = '';
      this.topicTemplatePreview = '';
      this.topicVariables = []
      
      Object.assign(this.selectedTopicType, this.topic_types[0])
      this.topicTypeChanged()
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
    cancelTopic() {
      this.topicDialog=false
    },
    async saveTopic() {
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
      
      this.saving = true
      let ret = await this.$store.dispatch('saveTopic', topic).then((data) => {
        this.$emit('newTopicIsAdded');
        if(!data['error'])return true
        return false
      })
      
      if (ret){
        this.topicDialog = false;
      }
      this.saving = false
    },
    updateTemplatePreview() {
      if(this.topicTemplate){
        let topicTemplate = this.topicTemplate
        for(let i = 0; i < this.topicVariables.length; i++){
          let topicVariable = this.topicVariables[i]
          topicTemplate = topicTemplate.replace('%%' + topicVariable.name + '%%', topicVariable.value)
        }
        this.topicTemplatePreview = topicTemplate
      }
    },
    changeTopicVariables(){
      this.updateTemplatePreview()
    },
    topicTypeChanged() {
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
    },
  },
  watch: {
    topicTransaction() {
      if(this.selectedTopicType){
        this.topicName = this.selectedTopicType.name + ' for ' + this.topicTransaction
      }
    },
    topicTemplate() {
      this.updateTemplatePreview()
    }
  }
}
</script>

<style scoped>

</style>