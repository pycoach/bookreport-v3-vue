<template>
  <v-col sm="12" md="6" lg="6">
    <v-card >
      <v-toolbar style="border: none">
        <v-card-title>Topic Types
          <div class="vertical-divider vertical-divider--small"></div>
          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="">
          <v-text-field
            class="card-search"
            label="Find Topic Types"
            placeholder="Find Topic Types"
            v-model="topicTypeSearch"
          >
          </v-text-field>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn 
          class="ml-5 btn-primary btn-primary--small"
          @click="addTopicType"
        >
          + Add
        </v-btn>
      </v-toolbar>
      <v-simple-table>
        <template>
          <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Description</th>
            <th class="text-left">Action</th>
          </tr>
          </thead>
          <tbody >
          <tr v-for="(topicType, index) in filteredTopicTypes"  @click="editTopicType(topicType)" :key="index" >
            <td style="width: 40%">{{ topicType.name }}</td>
            <td v-if="!topicType.description" style="width: 60%"></td>
            <td v-else style="width: 60%">{{ topicType.description.length > 25 ? topicType.description.slice(0, 25) + '...' : topicType.description }}</td>
            <td>
              <v-btn icon @click.stop="deleteTopicType(topicType.entity_id)">
                <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <!--Dialog-->
    <v-dialog persistent v-model="topicTypeDialog" max-width="80%">
      <v-card>
        <v-card-title class="headline">{{topicTypeEditMode}} Topic Type</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field 
                label="Name*"                
                v-model="topicTypeName"
              />
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea 
                label="Description"
                v-model="topicTypeDescription"                
                outlined
                auto-grow
                rows="2"
                row-height="10" 
              />
            </v-flex>
            <v-flex xs12 md12>
              <table class="topictype-table" style="width:100%;">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Data Type</th>
                  <th>Example Value</th>
                  <th>Action</th>
                </tr>
                <tr v-for="(item, index) in topicTypeVariables" :key="index">
                  <td>
                    <div v-if="!item.edit">{{ item.name }}</div>
                    <v-text-field v-else v-model="activeTopicTypeVariable.name"></v-text-field>
                  </td>
                  <td>
                    <div v-if="!item.edit">{{ item.description }}</div>
                    <v-text-field v-else v-model="activeTopicTypeVariable.description"></v-text-field>
                  </td>
                  <td>
                    <div v-if="!item.edit">{{ item.data_type }}</div>
                    <v-select v-else v-model="activeTopicTypeVariable.data_type" :items="['Text', 'Number', 'Date']"></v-select>
                  </td>
                  <td>
                    <div v-if="!item.edit">{{ item.example_value }}</div>
                    <v-text-field v-else v-model="activeTopicTypeVariable.example_value"></v-text-field>
                  </td>
                  <td>
                    <div v-if="item.name === ''">
                      <v-btn :disabled="!item.edit || !activeTopicTypeVariable.name || !activeTopicTypeVariable.data_type" @click="addTopicTypeVariable()">add</v-btn>
                      <v-btn :disabled="!item.edit" @click="clearTopicTypeVariable()">clear</v-btn>
                    </div>
                    <div v-else-if="!item.edit">
                      <v-btn @click="editTopicTypeVariable(item)">edit</v-btn>
                      <v-btn @click="deleteTopicTypeVariable(item)">delete</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="saveTopicTypeVariable(item)">Save</v-btn>
                      <v-btn @click="cancelTopicTypeVariable(item)">Cancel</v-btn>
                    </div>
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs12 md12>
              <v-tabs grow v-model="topicTypeTab">
                <v-tab>Template</v-tab>
                <v-tab>Preview</v-tab>
              </v-tabs>
              <v-divider/>
              <v-tabs-items v-model="topicTypeTab">
                <v-tab-item key="topic-1">
                  <ckeditor :editor="editor" v-model="topicTypeTemplate" :config="editorConfig" />
                </v-tab-item>
                <v-tab-item key="topic-2">
                  <div class="tiptap-vuetify-editor__content" v-html="topicTypePreview"/>
                </v-tab-item>
              </v-tabs-items>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="cancelTopicType"
          >
            Cancel
          </v-btn>
          <v-btn 
            :disabled="!canSave() || topicTypeVariables.length == 1" 
            class="ml-5 btn-primary btn-primary--small" 
            text 
            @click="saveTopicType"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import {mapGetters} from "vuex";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: 'TopicTypes',
  computed: {
    ...mapGetters(['activeProject', 'topic_types']),
    filteredTopicTypes() {
      return this.topic_types.filter(topic_type => {
        return topic_type.name.toLowerCase().indexOf(this.topicTypeSearch.toLowerCase()) > -1
      })
    }
  },
  data() {
    return {
      topicTypeName: '',
      topicTypeDescription: '',
      topicTypeDialog: false,
      topicTypeEditMode: 'Create',
      topicTypeSearch:'',
      activeTopicType: {},
      topicTypeTab: null,
      topicTypeTemplate: '',
      topicTypePreview: '',
      topic_type_headers: [
        { text: 'Name',value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Data Type', value: 'data_type' },
        { text: 'Example Value', value: 'example_value' },
      ],
      activeTopicTypeVariable: {},
      topicTypeVariables: [
        {
          name: '',
          description: '',
          data_type: '',
          example_value: '',
          edit: true
        },
      ],
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  methods: {
    canSave() {
      return /^[^.\s]/.test(this.topicTypeName)
    },
    addTopicType() {
      this.topicTypeEditMode = 'Create';
      this.topicTypeDialog = true;
    
      this.activeTopicType = {
        'project_id': this.activeProject.entity_id
      };
      this.topicTypeName = '';
      this.topicTypeDescription = '';
      this.topicTypeTemplate = '';
      this.topicTypeVariables = [
        {
          name: '',
          description: '',
          data_type: '',
          example_value: '',
          edit: true
        },
      ];
      this.activeTopicTypeVariable = {}
      this.activeTopicType = {}
    },
  
    editTopicType(topicType) {
      this.topicTypeEditMode = 'Edit';
      this.topicTypeDialog = true;
    
      Object.assign(this.activeTopicType, topicType);
      this.topicTypeName = topicType['name'];
      this.topicTypeDescription = topicType['description'];
      this.topicTypeVariables = topicType['variables'];
      this.topicTypeVariables.push(
        {
          name: '',
          description: '',
          data_type: '',
          example_value: '',
          edit: true
        }
      );
      this.activeTopicTypeVariable = {};
      this.topicTypeTemplate = topicType['template']
    },
    deleteTopicType(id) {
      this.$store.dispatch('deleteTopicType', id)
    },
    saveTopicType() {
      this.activeTopicType['name'] = this.topicTypeName;
      this.activeTopicType['description'] = this.topicTypeDescription;
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        delete this.topicTypeVariables[i].edit;
        if(this.topicTypeVariables[i].name === ''){
          this.topicTypeVariables.splice(i, 1)
        }
      }
      this.activeTopicType['variables'] = this.topicTypeVariables;
      this.activeTopicType['template'] = this.topicTypeTemplate;
    
      this.$store.dispatch('saveTopicType', this.activeTopicType).then(() => {
        this.topicTypeDialog = false;
      })
    },
    cancelTopicType() {
      this.topicTypeDialog = false;
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        delete this.topicTypeVariables[i].edit
        if(this.topicTypeVariables[i].name === ''){
          this.topicTypeVariables.splice(i, 1)
        }
      }
    },
    addTopicTypeVariable() {
      if(this.activeTopicTypeVariable.name && this.activeTopicTypeVariable.data_type){
      
        this.activeTopicTypeVariable.edit = false;
        this.topicTypeVariables.splice(this.topicTypeVariables.length-1, 0, this.activeTopicTypeVariable);
        this.activeTopicTypeVariable = {}
      }
    
    },
  
    clearTopicTypeVariable() {
      this.activeTopicTypeVariable = {}
    },
    editTopicTypeVariable(variable) {
      Object.assign(this.activeTopicTypeVariable, variable);
    
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        this.topicTypeVariables[i].edit = this.topicTypeVariables[i].name === variable.name;
      }
    },
  
    deleteTopicTypeVariable(variable) {
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].name === variable.name){
          this.topicTypeVariables.splice(i, 1)
        }
      }
    
    },
  
    saveTopicTypeVariable(variable) {
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].name === variable.name){
          Object.assign(this.topicTypeVariables[i], this.activeTopicTypeVariable);
          this.topicTypeVariables[i].edit = false
        }
      }
      this.topicTypeVariables[this.topicTypeVariables.length-1].edit = true;
      this.activeTopicTypeVariable = {}
      this.updateTemplatePreview()
    },  
    cancelTopicTypeVariable(variable) {
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].id === variable.id){
          this.topicTypeVariables[i].edit = false
        }
      }
      this.topicTypeVariables[this.topicTypeVariables.length-1].edit = true;
      this.activeTopicTypeVariable = {}
    },
    updateTemplatePreview(){      
      let topicTypeTemplate = this.topicTypeTemplate
      for(let i = 0; i < this.topicTypeVariables.length; i++){
       let topicTypeVariable = this.topicTypeVariables[i]        
        topicTypeTemplate = topicTypeTemplate.replace('%%' + topicTypeVariable.name + '%%', topicTypeVariable.example_value)
      }
      this.topicTypePreview = topicTypeTemplate
    }
  },
  watch: {
    topicTypeTemplate(){
      this.updateTemplatePreview()
    }
  }
}
</script>

<style scoped>

</style>