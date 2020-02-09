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
                      <v-select label="Topic"                        
                        v-model="selectedTopic"
                        item-text="name"
                        return-object
                        :items="topics"
                      >
                      </v-select>
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

        <v-dialog persistent v-model="reportDialog" max-width="500">
          <v-card>
            <v-card-title class="headline">Create Report</v-card-title>
            <v-container grid-list-xl fluid>
              <v-layout row wrap>
                <v-flex xs12 md12>
                    <v-text-field 
                      label="Name"
                      clearable
                      v-model="reportName"
                    />                  
                  </v-flex>                
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions >
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="reportDialog=false">
                Cancel
              </v-btn>
              <v-btn 
                class="ml-5 btn-primary btn-primary--small" 
                text 
                @click="saveReport"
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
                  <v-list two-line>
                    <draggable :list="report_objects" group="report" @change="changeReportObjects">    
                      <template v-for="(report_object, index) in report_objects">
                        <v-list-item
                          :key="report_object.entity_id"
                          @click="editReportObject(report_object)">

                          <v-list-item-content>
                            <v-list-item-title v-html="report_object.sub_type"></v-list-item-title>
                          </v-list-item-content>
                          <v-btn icon @click.stop="deleteReportObject(report_object.entity_id)">
                            <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                          </v-btn>
                        </v-list-item>                        
                      </template>
                    </draggable>
                  </v-list>
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
                  <v-list two-line>
                    <draggable :list="topics" group="report" @change="changeTopics">    
                      <template v-for="(topic, index) in topics">
                        <v-list-item :key="topic.entity_id" @click="">
                          <v-list-item-content>
                            <v-list-item-title v-html="topic.name"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>                        
                      </template>
                    </draggable>
                  </v-list>                
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-col>

      <v-col sm="12" md="6" lg="6">
      <v-layout wrap>
          <v-row v-if="Object.entries(activeReport).length == 0"> 
            <v-col sm="12" md="12" lg="12">
              <v-card height="100%">
                <v-toolbar style="border: none">
                  <v-card-title>Reports</v-card-title>
                  <v-spacer />
                  <v-btn class="ml-5 btn-primary btn-primary--small" @click="addReport">+ Add</v-btn>
                </v-toolbar>
                <v-container grid-list-xl fluid>
                  <v-simple-table>
                    <template>
                      <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-right">Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(report, index) in reports"  @click="editReport(report)" :key="report.entity_id" >
                        <td style="width: 90%">{{ report.name }}</td>
                        <td>
                          <v-btn icon @click.stop="deleteReport(report.entity_id)">
                            <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                          </v-btn>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else> 
            <v-col sm="12" md="12" lg="12">
              <v-card height="100%">
                <v-toolbar style="border: none">
                  <img 
                    style="cursor: pointer; width: 12px;" 
                    class="mr-4" 
                    src="../../../assets/icons/back.svg" 
                    alt=""
                    @click="closeReport"
                  >
                  <v-card-title>{{activeReport.name}}</v-card-title>
                  <v-spacer />
                  <v-btn class="ml-5 btn-primary btn-primary--small" @click="downloadReport">Download</v-btn>
                </v-toolbar>
                <v-container fluid>
                  <v-list two-line>
                    <draggable :list="activeReport.report_objects" group="report" @change="changeReports">    
                      <template v-for="(report, index) in activeReport.report_objects">
                        <v-list-item
                          :key="report.entity_id"
                          @click="">

                          <v-list-item-content>
                            <v-list-item-title v-if="report.sub_type" v-html="report.sub_type"></v-list-item-title>
                            <v-list-item-title v-html="report.name"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>                        
                      </template>
                    </draggable>
                  </v-list>
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

export default {
  name: 'Reports',
  components: {
    draggable
  },
  computed: {
    ...mapGetters([
      'activeProject', 
      'topic_types', 
      'topics', 
      'trades', 
      'transactions', 
      'report_objects', 
      'activeReport_object', 
      'reports', 
      'activeReport'
    ]),
  },
  mounted(){
    this.$store.dispatch('loadReports', this.activeProject.entity_id)
    this.$store.dispatch('loadReport_objects', this.activeProject.entity_id)
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
      selectedTopic: null,

      reportObjects: [],
      reportObjectdialog: false,

      reportName: '',
      reportDialog: false,
      reportObjectEditMode: 'Create',
      documentTypes: ["Fund - Financial",
        "Fund - Memo", 
        "Investment - Financial", 
        "Investment - Legal",
        "Investment - Memo", 
        "Investment - Value Model"],
    }
  },
  methods: {
    addReportObject() {
      this.reportObjectEditMode = 'Create';
      this.sub_type = 'Chapter'
      this.header_template = ''
      this.footer_template = ''
      this.body = ''
      this.css = ''
      this.file_path = ''
      this.page_number_start_page = 0
      this.page_number_start_number = 0
      this.selectedTopic = null
      
      this.reportObjectdialog = true
    },
    editReportObject(report_object) {
      this.reportObjectEditMode = 'Edit';
      this.reportObjectdialog = true

      this.sub_type = report_object.sub_type
      if(report_object.sub_type == 'Chapter'){        
        this.header_template = report_object.header_template
        this.footer_template = report_object.footer_template
        this.page_number_start_page = report_object.page_number_start_page
        this.page_number_start_number = report_object.page_number_start_number
      }
      else if(report_object.sub_type == 'Title'){
        this.body = report_object.body
        this.css = report_object.css
      }
      else if(report_object.sub_type == 'Graphic'){
        this.file_path = report_object.file_path
        this.css = report_object.css
      }
      else if(report_object.sub_type == 'Report Section'){
        for(let i = 0; i < this.topics.length; i++){
          if(report_object.topic_id == this.topics[i].entity_id){
            this.selectedTopic = this.topics[i]
          }
        }
      }
    },
    saveReportObject() {
      this.reportObjectdialog = false
      let report_object = {
        project_id: this.activeProject.entity_id,
        sub_type: this.sub_type
      }
      if(this.sub_type == 'Chapter'){
        report_object.header_template = this.header_template
        report_object.footer_template = this.footer_template
        report_object.page_number_start_page = parseInt(this.page_number_start_page)
        report_object.page_number_start_number = parseInt(this.page_number_start_number)
      }
      else if(this.sub_type == 'Title'){
        report_object.body = this.body
        report_object.css = this.css
      }
      else if(this.sub_type == 'Graphic'){
        report_object.file_path = this.file_path
        report_object.css = this.css
      }
      else if(this.sub_type == 'Report Section'){
        report_object.topic_id = this.selectedTopic.entity_id
        report_object.trade = this.selectedTopic.trade
        report_object.transaction = this.selectedTopic.transaction
        report_object.template = this.selectedTopic.template
        report_object.variables = this.selectedTopic.variables
      }

      this.$store.dispatch('saveReport_object', report_object)
    },
    deleteReportObject(id) {
      this.$store.dispatch('deleteReport_object', id)
    },
    changeReportObjects(evt){    
      console.log(evt)  
      if(evt.added){   
        let report_object = evt.added.element
        delete report_object.entity_id
        delete report_object.version
        delete report_object.changed_on
        this.$store.dispatch('saveReport_object', report_object)
      }
      else if(evt.removed){
        let report_object = evt.removed.element
        this.$store.dispatch('deleteReport_object', report_object.entity_id)
      }
      else if(evt.moved){
      }
    },
    addReport() {
      this.reportDialog = true
      this.reportName = ''
    },
    editReport(report) {
      this.$store.dispatch('getReport', report.entity_id)
    },
    saveReport() {
      this.reportDialog = false
      const report = {
        project_id: this.activeProject.entity_id,
        name: this.reportName,
        report_objects: []
      }
      this.$store.dispatch('saveReport', report)
    },
    deleteReport(id) {
      this.$store.dispatch('deleteReport', id)
    },
    closeReport(){
      this.$store.commit('setActiveReport', {})
    },
    changeReports(evt){
      let new_report = this.activeReport

      if(evt.added){        
        let i = evt.added.newIndex
        if(!new_report.report_objects[i].id){
          new_report.report_objects[i].id = new_report.report_objects[i].entity_id

          if(i == 0){
            new_report.report_objects[i].previous_id = ''  

            if(new_report.report_objects.length == 1){  
              new_report.report_objects[i].next_id = '' 
            }
            else {
              new_report.report_objects[i].next_id = new_report.report_objects[i+1].id
              new_report.report_objects[i+1].previous_id = new_report.report_objects[i].id
            }
          }
          else if(i == new_report.report_objects.length-1){
            new_report.report_objects[i].previous_id = new_report.report_objects[i-1].id 
            new_report.report_objects[i].next_id = ''

            new_report.report_objects[i-1].next_id = new_report.report_objects[i].id              
          }
          else {
            new_report.report_objects[i-1].next_id = new_report.report_objects[i].id 
            new_report.report_objects[i].previous_id = new_report.report_objects[i-1].id 
            new_report.report_objects[i].next_id = new_report.report_objects[i+1].id
            new_report.report_objects[i+1].previous_id = new_report.report_objects[i].id 
          }
        }        
      }
      else if(evt.removed){
        let new_report = this.activeReport
        let i = evt.removed.oldIndex
        if(i == 0){
          if(new_report.report_objects.length > 0){
            new_report.report_objects[0].previous_id = ''
          }                  
        }
        else if(i == new_report.report_objects.length){
          new_report.report_objects[i-1].next_id = ''
        }
        else {
          new_report.report_objects[i-1].next_id = new_report.report_objects[i].id
          new_report.report_objects[i].previous_id = new_report.report_objects[i-1].id
        }
      }
      else if(evt.moved){
        old_index = evt.moved.oldIndex
        new_index = evt.moved.newIndex

        if((old_index == 0) && (new_index == 1)){
          new_report.report_objects[0].previous_id = ''
          new_report.report_objects[0].next_id = new_report.report_objects[1].id

          new_report.report_objects[1].previous_id = new_report.report_objects[0].id
          new_report.report_objects[1].next_id = ''
        }
        else {
          if(old_index == 0){
            new_report.report_objects[0].previous_id = ''            
          }
          else if(old_index == new_report.report_objects.length-1){
            new_report.report_objects[old_index].next_id = ''
          }
          else {
            new_report.report_objects[old_index-1].next_id = new_report.report_objects[old_index].id
            new_report.report_objects[old_index].previous_id = new_report.report_objects[old_index-1].id
          }

          if(new_index == 0){
            new_report.report_objects[0].previous_id = ''
            new_report.report_objects[0].next_id = new_report.report_objects[1].id
            new_report.report_objects[1].previous_id = new_report.report_objects[0].id
          }
          else if(new_index == new_report.report_objects.length-1){
            new_report.report_objects[new_index].next_id = ''
            new_report.report_objects[new_index].previous_id = new_report.report_objects[new_index-1].next_id
            new_report.report_objects[new_index-1].next_id = new_report.report_objects[new_index].id

          }
          else{
            new_report.report_objects[new_index-1].next_id = new_report.report_objects[new_index].id

            new_report.report_objects[new_index].previous_id = new_report.report_objects[new_index-1].id
            new_report.report_objects[new_index].next_id = new_report.report_objects[new_index+1].id

            new_report.report_objects[new_index+1].previous_id = new_report.report_objects[new_index].id
          }
        }
      }
      this.$store.dispatch('saveReport_object', new_report)
    },
    downloadReport() {
      this.$store.dispatch('downloadReport', this.activeReport.entity_id)
    },
    changeTopics(evt){
    },
  },
  watch: {
    report_objects() {
      this.reportObjects = this.report_objects
    }
  }
}
</script>

<style scoped>
.list-group-item {
}
.list-group {
  margin: 4px;
}
</style>