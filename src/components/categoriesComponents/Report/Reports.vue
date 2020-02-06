<template>
  <v-layout wrap>
    <v-row>  
      <v-col sm="12" md="6" lg="6">
        <!--Dialog -->
        <v-dialog persistent v-model="reportObjectdialog" max-width="500">
          <v-card>
            <v-card-title class="headline">{{reportObjectEditMode}} Report Object</v-card-title>
            <v-container grid-list-xl fluid>
              <v-layout row wrap>
                <v-flex xs12 md12>
                  <v-select label="Sub Type"                        
                    v-model="sub_type"
                    :items="['Chapter', 'Title', 'Page Break', 'Graphic', 'Table of Contents', 'Report Section']"
                  >
                  </v-select>                  
                </v-flex>
                <v-container v-if="sub_type=='Chapter'" grid-list-xl fluid>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="Header Template"
                      clearable
                      v-model="header_template"
                    />                  
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="Footer Template"
                      clearable
                      v-model="footer_template"
                    />                  
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="Page Number Start Page"
                      clearable
                      v-model="page_number_start_page"
                    />  
                  </v-flex> 
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="Page Number Start Number"
                      clearable
                      v-model="page_number_start_number"
                    />  
                  </v-flex>
                </v-container>
                <v-container v-if="sub_type=='Title'" grid-list-xl fluid>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="Body"
                      clearable
                      v-model="body"
                    />                  
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="CSS"
                      clearable
                      v-model="css"
                    />                  
                  </v-flex>
                </v-container>
                <v-container v-if="sub_type=='Graphic'" grid-list-xl fluid>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="File Path"
                      clearable
                      v-model="file_path"
                    />                  
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field 
                      label="CSS"
                      clearable
                      v-model="css"
                    />                  
                  </v-flex>
                </v-container>
                <v-container v-if="sub_type=='Report Section'"grid-list-xl fluid >
                  <v-layout row wrap>
                    <v-flex xs12 md12>
                      <v-select label="Topic Type"                        
                        v-model="selectedTopicType"
                        item-text="name"
                        return-object
                        :items="topic_types"
                      >
                      </v-select>
                    </v-flex>
                    <v-flex xs12 md12>
                      <v-text-field label="Topic Name"
                        v-model="topicName"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 md12>
                      <v-select label="Trade"
                        v-model="topicTrade"
                        item-text="name"
                        :items="trades"
                      >
                      </v-select>
                    </v-flex>
                    <v-flex xs12 md12>
                      <v-select label="Transaction"
                        v-model="topicTransaction"
                        item-text="name"
                        :items="transactions"
                      >
                      </v-select>
                    </v-flex>
                    <v-flex xs12 md12>
                      <v-select label="Document"
                        v-model="topicDocumentType"
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
              </v-layout>
            </v-container>
            <v-card-actions >
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="reportObjectdialog=false">
                Cancel
              </v-btn>
              <v-btn 
                class="ml-5 btn-primary btn-primary--small" 
                text 
                @click="saveReportObject"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> 

        <v-layout wrap>
          <v-row> 
            <v-col sm="12" md="12" lg="12">
              <v-card height="100%">
                <v-toolbar style="border: none">
                  <v-card-title>Report Objects</v-card-title>
                  <v-spacer />
                  <v-btn class="ml-5 btn-primary btn-primary--small" @click="addReportObject">+ Add</v-btn>
                </v-toolbar>
                <v-container fluid>
                  <draggable :list="report_objects" group="report" @change="log">
                    <div
                      class="list-group-item"
                      v-for="(element, index) in report_objects"
                      :key="element.name"
                    >
                      {{ element.name }} {{ index }}
                    </div>
                  </draggable>
                </v-container>
              </v-card>
            </v-col>
            <v-col sm="12" md="12" lg="12">
              <v-card height="100%">
                <v-toolbar style="border: none">
                  <v-card-title>Topics</v-card-title>
                  <v-spacer />
                </v-toolbar>
                <v-container fluid> 
                  <draggable class="list-group" :list="topics" group="report" @change="log">
                    <div
                      class="list-group-item"
                      v-for="(element, index) in topics"
                      :key="element.name"
                    >
                      {{ element.name }} {{ index }}
                    </div>
                  </draggable>                 
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-col>

      <v-col sm="12" md="6" lg="6">
      <v-layout wrap>
          <v-row> 
            <v-col sm="12" md="12" lg="12">
              <v-card height="100%">
                <v-toolbar style="border: none">
                  <v-card-title>Report</v-card-title>
                </v-toolbar>
                <v-container fluid>
                  <draggable v-if="report" class="list-group" :list="report.report_objects" group="report" @change="log">
                    <div
                      class="list-group-item"
                      v-for="(element, index) in report.report_objects"
                      :key="element.name"
                    >
                      {{ element.name }} {{ index }}
                    </div>
                  </draggable>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex';
import draggable from "vuedraggable";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'Reports',
  components: {
    draggable
  },
  computed: {
    ...mapGetters(['activeProject', 'topic_types', 'topics', 'trades', 'transactions']),
  },
  data() {
    return {
      sub_type: 'Chapter',
      header_template: '',
      footer_template: '',
      body: '',
      css: '',
      file_path: '',
      page_number_start_page: 0,
      page_number_start_number: 0,
      selectedTopicType: null,
      topicName: '',
      topicTrade: '',
      topicTransaction:'',
      topicDocumentType: '',
      topicVariables: [],
      topicTab: null,
      topicTemplate: '',
      reportObjectdialog: false,
      reportObjectEditMode: 'Create',
      report_objects: [],
      report: null,
      documentTypes: ["Fund - Financial","Fund - Memo", "Investment - Financial", "Investment - Legal",
        "Investment - Memo", "Investment - Value Model"],
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  methods: {
    addReportObject() {
      this.reportObjectEditMode = 'Create';
      this.reportObjectdialog = true
    },
    editReportObject(report_object) {
      this.reportObjectEditMode = 'Edit';
      this.reportObjectdialog = true
    },
    saveReportObject() {
      this.reportObjectdialog = false
    },
    deleteReportObject(id) {
    },
    addReport() {
    },
    editReport(report) {
    },
    saveReport() {
    },
    deleteReport(id) {
    },
    add: function() {
      this.list.push({ name: "Juan" });
    },
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    log: function(evt) {
      window.console.log(evt);
    }
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
    }

  }
}
</script>

<style scoped>
.list-group-item {
  border-style: solid;
  border-color: black;
  margin: 2px;
}
.list-group {
  margin: 2px;
}
</style>