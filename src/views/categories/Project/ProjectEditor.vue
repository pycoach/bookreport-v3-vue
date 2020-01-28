<template>
  <div class=''>
     <div class="d-flex justify-space-between base-y-padding">
      <div class="d-flex align-center">
       <img style="cursor: pointer" class="mr-4" src="../../../assets/icons/back.svg" alt="" @click="$router.push('/project')">
      <quick-edit  v-on:input="saveProject" class="top-header " v-model="name" :emptyText="editMode == 'Create'  ?  'Create Project' : 'Loading'">
        
        <template v-slot:button-cancel >
         <img class="close-icon" src="../../../assets/icons/close.svg" alt="">
      </template>
      <template v-slot:button-ok >
         <img class="check-icon" src="../../../assets/icons/check.svg" alt="">
      </template>
       
      </quick-edit>
        </div>
    </div>

    <!-- Dialogs -->
    <v-dialog persistent v-model="userDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{userEditMode}} User</v-card-title>
        <v-container grid-list-xl fluid >
            <v-layout row wrap>
              <v-flex md12>
                <v-text-field v-if="userEditMode == 'Add'"
                v-model="username"
                required
                prepend-icon="person"
                label="Name"></v-text-field>
                <v-text-field 
                v-else :disabled="true" 
                v-model="username" 
                prepend-icon="person"
                label="Name"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex md12>
                <v-text-field 
                v-if="userEditMode == 'Add'"
                v-model="useremail"
                label="Email"
                required
                prepend-icon="mail"
                :rules="emailRules"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex md12>
                <v-select
                :items="userRoles"
                item-text="name"
                v-model="userRole"
                label="Role"
                @change="userRoleChanged"
              ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="userDialog=false">Cancel</v-btn>
          <v-btn class="ml-5 btn-primary btn-primary--small"  @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="tradeDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{tradeEditMode}} Trade</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Name"
                clearable
                v-model="tradeName">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Description"
                v-model="tradeDescription"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn  color="primary" text @click="tradeDialog=false">
            Cancel
          </v-btn>
          <v-btn  class="ml-5 btn-primary btn-primary--small"  text @click="saveTrade">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="transactionDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{transactionEditMode}} Transaction</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Name"
                clearable
                v-model="transactionName">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Description"
                v-model="transactionDescription"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="trades"
                item-text="name"
                v-model="transactionTrade"
                label="Trade"
                return-object
                @change="transactionTradeChanged"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="transactionDialog=false">
            CANCEL
          </v-btn>
          <v-btn  class="ml-5 btn-primary btn-primary--small" text @click="saveTransaction">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="informationDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Request Information</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Subject"
                clearable
                v-model="informationSubject">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="clients"
                item-text="name"
                v-model="informationClient"
                label="To"
                return-object
              ></v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Body"
                v-model="informationBody"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>            
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="informationDialog=false">
            CANCEL
          </v-btn>
          <v-btn class="ml-5 btn-primary btn-primary--small" text @click="onSaveInformation">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="documentDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Request Document</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Subject"
                clearable
                v-model="documentSubject">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-select
                :items="clients"
                item-text="name"
                v-model="documentClient"
                label="To"
                return-object
              ></v-select>
            </v-flex>
            <v-flex xs12 md12>
              <v-combobox
                v-model="documents"
                :items="[]"
                label="Documents"
                multiple
                chips
                :delimiters="[' ', ',']"
              ></v-combobox>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Body"
                v-model="documentBody"
                outlined
                auto-grow
                rows="4"
                row-height="30">
              </v-textarea>
            </v-flex>            
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
               
          <v-btn color="primary" text @click="documentDialog=false">
            CANCEL
          </v-btn>
          <v-btn class="ml-5 btn-primary btn-primary--small" text @click="onSaveDocument">
            SAVE
          </v-btn>

                  
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="fileDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Upload Files</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
                <v-select
                  v-model="selectedDocumentTypes"
                  :items="documentTypes"
                  label="Document Type(s)"
                  multiple chips deletable-chips clearable dense
                />
            </v-flex>
            <v-flex xs12 md12>
                <v-combobox
                  v-model="selectedDocumentTransactions"
                  :items="documentTransactions"
                  label="Transactions"
                  multiple chips small-chips deletable-chips clearable dense
                />
            </v-flex>
            <v-flex xs12 md12>
                <v-combobox
                  v-model="selectedDocumentTrades"
                  :items="documentTrades"
                  label="Trades"
                  multiple chips small-chips deletable-chips clearable dense
                />
            </v-flex>
            <v-flex xs12 md12>
                <Dropzone
                  ref="dropzone"
                  @queuecomplete="queuecomplete"
                />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn 
            color="primary" 
            text 
            @click="cancelUpload"
          >
            CANCEL
          </v-btn>
          <v-btn
            class="ml-5 btn-primary btn-primary--small"
            text
            :disabled="uploading"
            :loading="uploading"
            @click="uploadFiles"
          >
            UPLOAD
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="topicTypeDialog" max-width="80%">
      <v-card>
        <v-card-title class="headline">{{topicTypeEditMode}} Topic Type</v-card-title>
        <v-container grid-list-xl fluid >
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-text-field label="Name"
                clearable
                v-model="topicTypeName">
              </v-text-field>
            </v-flex>
            <v-flex xs12 md12>
              <v-textarea label="Description"
                v-model="topicTypeDescription"
                clearable
                outlined
                auto-grow
                rows="2"
                row-height="10">
              </v-textarea>
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
                    <div v-if="!item.edit">{{item.name}}</div>
                    <v-text-field v-else v-model="activeTopicTypeVariable.name"></v-text-field>
                  </td>
                  <td>
                    <div v-if="!item.edit">{{item.description}}</div>
                    <v-text-field v-else v-model="activeTopicTypeVariable.description"></v-text-field>
                  </td>
                  <td>
                    <div v-if="!item.edit">{{item.data_type}}</div>
                    <v-select v-else v-model="activeTopicTypeVariable.data_type" :items="['Text', 'Number', 'Date']"></v-select>
                  </td>
                  <td>
                    <div v-if="!item.edit">{{item.example_value}}</div>
                    <v-text-field v-else v-model="activeTopicTypeVariable.example_value"></v-text-field>
                  </td>
                  <td>
                    <div v-if="item.name==''">                      
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
                  <ckeditor :editor="editor" v-model="topicTypeTemplate" :config="editorConfig"></ckeditor>
                </v-tab-item>
                <v-tab-item key="topic-2">                           
                  <div class="tiptap-vuetify-editor__content" v-html="topicTypeTemplate"/>
                </v-tab-item>
              </v-tabs-items>              
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn  color="primary" text @click="cancelTopicType">
            Cancel
          </v-btn>
          <v-btn  :disabled="topicTypeName=='' || topicTypeVariables.length == 1" class="ml-5 btn-primary btn-primary--small"  text @click="saveTopicType">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                :items="['Financial', 'Experimental', 'Non-proficient']"
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
                  <ckeditor :editor="editor" v-model="topicTemplate" :config="editorConfig"></ckeditor>
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

  <!-- Layout -->
  <v-tabs 
    :ripple="false"
    class="base-y-padding top-custom-tabs" >
    <v-tab :disabled="activeProjectIsLoading">Overview</v-tab>
    <v-tab :disabled="activeProjectIsLoading">Trades and transactions</v-tab>
    <v-tab :disabled="activeProjectIsLoading">Documents</v-tab>
    <v-tab :disabled="activeProjectIsLoading">Reports</v-tab>
    <v-tab :disabled="activeProjectIsLoading">Workesheet</v-tab>
    <v-tab :disabled="activeProjectIsLoading">Topic</v-tab>
    <v-tab :disabled="activeProjectIsLoading">Users</v-tab>

    <v-tab-item key="1" class="overview">
       <v-row class="mb-6" >
             <v-col sm="12" md="5" lg="5"   >
                <v-card>
                  <v-toolbar>
                    <v-card-title v-if="editMode == 'Create'"
                      class="headline">
                      {{ editMode }} Project
                    </v-card-title>
                    <v-card-title v-else 
                      class="headline">
                      Description
                    </v-card-title>
                    <v-spacer></v-spacer>
                      <v-btn v-if="!editDescriptionMode && editMode != 'Create'"  class="ml-5 btn-grey btn-grey--square"
                             @click="editDescription">
                         <img  src="../../../assets/icons/edit-pencil.svg" alt="">
                      </v-btn>
                  </v-toolbar>
                  <v-container grid-list-xl fluid>
                    <v-layout row wrap>   
                      <v-flex xs12 md12 v-if="editMode == 'Create' || editDescriptionMode">
                        <v-text-field label="Name"
                          
                          clearable
                          class="px-3 mt-4"
                          v-model="name">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-textarea ref="description" class="description px-3" :class="{'no-edit-mode': !editDescriptionMode && editMode == 'Edit'}" label="Description"
                          v-model="description"
                          outlined
                          auto-grow

                          rows="4"
                          row-height="30">
                        </v-textarea>
                      </v-flex>    
                    </v-layout>
                  </v-container>
                  <v-card-actions v-if="editMode == 'Create' || editDescriptionMode" class="pa-5">
                    <v-spacer></v-spacer>
                    <v-btn v-if="editMode == 'Create'" color="primary" text @click="$router.push('/Project')">
                      CANCEL
                    </v-btn>
                    <v-btn v-if="editMode == 'Edit'" color="primary" text @click="editDescriptionOff(true)">
                      CANCEL
                    </v-btn>
                    <v-btn class="ml-5 btn-primary btn-primary--small" text @click="saveProject(); editDescriptionOff(false)">
                      SAVE
                    </v-btn>
                  </v-card-actions>
                </v-card>
             </v-col>
            <v-col sm="12" md="7" lg="7"  v-show="editMode == 'Edit'" >
                    <v-card >
                      <v-toolbar>
                        <v-card-title>Info Requests</v-card-title>
                        <v-spacer></v-spacer>
                           <v-btn  class="ml-5 btn-primary btn-primary--small"
                            @click="onRequestInformation">
                              Request Info
                            </v-btn>
                             <v-btn  class="ml-5 btn-primary btn-primary--small"
                             @click="onRequestDocument">
                              Request Doc.
                            </v-btn>
                      </v-toolbar>

                       <v-data-table
                      :headers="headers"
                      :items="desserts"
                      :items-per-page="5"
                      
                    ></v-data-table>

                    </v-card>
            </v-col>
       </v-row>
     </v-tab-item>
     <v-tab-item key="2" class="trades-transactions">
            <v-row class="mb-6" v-show="editMode == 'Edit'">
                <v-col sm="12" md="6" lg="6">
                    <v-card >
                      <v-toolbar style="border: none">
                        <v-card-title>Trades
                           <div class="vertical-divider vertical-divider--small"></div>
                          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="">
                          <v-text-field
                              class="card-search"
                              label="Find Projects"
                              placeholder="Find Trades"
                              v-model="tradeSearch"
                              >
                            </v-text-field>
                        </v-card-title>
                        <v-spacer></v-spacer>
                           <v-btn  class="ml-5 btn-primary btn-primary--small  "
                            @click="addTrade">
                              + Add
                            </v-btn>
                      </v-toolbar>
                         <v-simple-table >
                          <template  >
                            <thead  >
                              <tr>
                                <th class="text-left">Name</th>
                                <th class="text-left">Description</th>
                                <th class="text-left">Action</th>
                              </tr>
                            </thead>
                            <tbody >
                              <tr v-for="(trade, index) in filteredTrades"  @click="editTrade(trade)" :key="trade.entity_id" >
                                <td style="width: 40%">{{ trade.name }}</td>
                                <td style="width: 60%">{{ trade.description.length > 25 ? trade.description.slice(0, 25) + '...' : trade.description }}</td>
                                 <td>
                                    <v-btn icon @click.stop="deleteTrade(trade.entity_id)">
                                           <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                                    </v-btn></td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                    </v-card>
                </v-col>

                 <v-col sm="12" md="6" lg="6"   >
                  <v-card>
                    <v-toolbar style="border: none">
                      <v-card-title>Transactions
                          <div class="vertical-divider vertical-divider--small"></div>
                          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="">
                          <v-text-field
                            class="card-search"
                            label="Find Projects"
                            placeholder="Find Transactions"
                            v-model="transactionSearch"
                            >
                            </v-text-field>
                      </v-card-title>
                      <v-btn  class="ml-5 btn-primary btn-primary--small  "
                            @click="addTransaction">
                              + Add
                       </v-btn>
                    </v-toolbar>
                      <v-simple-table >
                          <template  >
                            <thead  >
                              <tr>
                                <th class="text-left">Name</th>
                                <th class="text-left">Description</th>
                                <th class="text-left">Action</th>
                              </tr>
                            </thead>
                            <tbody >
                              <tr v-for="(transaction, index) in filteredTransactions"  @click="editTransaction(transaction)" :key="transaction.entity_id" >
                                <td style="width: 40%">{{ transaction.name }}</td>
                                <td style="width: 60%">{{ transaction.description.length > 25 ? transaction.description.slice(0, 25) + '...' : transaction.description }}</td>
                                 <td>
                                    <v-btn icon @click.stop="deleteTransaction(transaction.entity_id)">
                                           <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                                    </v-btn></td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                    <!-- <v-list two-line>
                      <template v-for="(transaction, index) in transactions">
                        <v-list-item
                          :key="transaction.entity_id"
                          @click="editTransaction(transaction)">
                          <v-list-item-content>
                            <v-list-item-title v-html="transaction.name"></v-list-item-title>
                          </v-list-item-content>
                          <v-btn icon @click.stop="deleteTransaction(transaction.entity_id)">
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-item>
                        <v-divider
                          v-if="index < transactions.length - 1">
                        </v-divider>
                      </template>
                    </v-list> -->
                  </v-card>
              </v-col>
              </v-row>      
     </v-tab-item>

     <v-tab-item key="3">
         <Search />
         <FiltersList />
         <Documents @onUploadClick="onUploadFile" />
     </v-tab-item>

     <v-tab-item key="4">
         <v-layout row wrap class="">

         </v-layout>
     </v-tab-item>

     <v-tab-item key="5">
         <v-layout row wrap class="">

         </v-layout>
     </v-tab-item>

     <v-tab-item key="6">
      <v-row class="mb-6" v-show="editMode == 'Edit'">
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
                        <v-btn  class="ml-5 btn-primary btn-primary--small  "
                        @click="addTopicType">
                          + Add
                        </v-btn>
                  </v-toolbar>
                      <v-simple-table >
                      <template  >
                        <thead  >
                          <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Description</th>
                            <th class="text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody >
                          <tr v-for="(topicType, index) in filteredTopicTypes"  @click="editTopicType(topicType)" :key="topicType.entity_id" >
                            <td style="width: 40%">{{ topicType.name }}</td>
                            <td style="width: 60%">{{ topicType.description.length > 25 ? topicType.description.slice(0, 25) + '...' : topicType.description }}</td>
                              <td>
                                <v-btn icon @click.stop="deleteTopicType(topicType.entity_id)">
                                        <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                                </v-btn></td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                </v-card>
            </v-col>

              <v-col sm="12" md="6" lg="6"   >
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
                  <v-btn  v-show="userRole == 'provider admin'" class="ml-5 btn-primary btn-primary--small  "
                        @click="addTopic">
                          + Add
                    </v-btn>
                </v-toolbar>
                  <v-simple-table >
                      <template  >
                        <thead  >
                          <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="userRole == 'provider admin'">
                          <tr v-for="(topic, index) in filteredTopics"  @click="editTopic(topic)" :key="topic.entity_id" >
                            <td style="width: 100%">{{ topic.name }}</td>
                              <td>
                                <v-btn icon @click.stop="deleteTopic(topic.entity_id)">
                                        <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                                </v-btn></td>
                          </tr>
                        </tbody>

                        <tbody v-else>
                          <tr v-for="(topic, index) in filteredTopics" :key="topic.entity_id" >
                            <td style="width: 100%">{{ topic.name }}</td>
                          </tr>
                        </tbody>

                      </template>
                    </v-simple-table>
              </v-card>
          </v-col>
          </v-row>  
     </v-tab-item>

     <v-tab-item key="7">
       <v-row class="mb-6" v-show="editMode == 'Edit'">
                <v-col sm="12" md="6" lg="6">
                                  <v-card>
                    <v-toolbar >
                      <v-card-title>Users</v-card-title>
                      <v-spacer></v-spacer>
                          <v-btn  class="ml-5 btn-primary btn-primary--small  "
                            @click="addUser">
                              + Add
                            </v-btn>
                    </v-toolbar>
                    <v-list two-line style="min-height: 450px;">
                      <template v-for="(user, index) in users">
                        <v-list-item
                          :key="user.user_id"
                          @click="editUser(user)">
                          <v-list-item-content>
                            <v-list-item-title v-html="user.name"></v-list-item-title>
                          </v-list-item-content>
                          <v-btn icon @click.stop="deleteUser(user.user_id)">
                             <img class="close-icon" src="../../../assets/icons/trash.svg" alt="">
                          </v-btn>
                        </v-list-item>
                        <v-divider
                          v-if="index < users.length - 1">
                        </v-divider>
                      </template>
                    </v-list>
                  </v-card>
                </v-col>
       </v-row>
     </v-tab-item>

  </v-tabs>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QuickEdit from 'vue-quick-edit';
import Dropzone from '../../../components/categoriesComponents/Dropzone/VueDropzone';
import moment from 'moment'
import Search from "../../../components/categoriesComponents/Document/Search/Search";
import FiltersList from "../../../components/categoriesComponents/Document/Filter";
import Documents from "../../../components/categoriesComponents/Document/Documents";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
export default {
  name: 'ProjectEditor',
  components: { QuickEdit, Dropzone, Search, FiltersList, Documents },
  props: ['id'],
  data() {
    return {
       headers: [
          {
            text: 'Sent to',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Type', value: 'type' },
          { text: 'Requested info', value: 'request' },
          { text: 'Date', value: 'date' },
          { text: 'Status', value: 'status' },
         
        ],
        desserts: [
          {
            name: 'John Smith',
            type: 'Document',
            request: 'Mothly statement from bank',
            date: '1/6/2020',
            status: 'AWAITING',
          },
          {
            name: 'Sanna Sadler',
            type: 'Info',
            request: 'Financial and legal documents, investment memos, contracts, etc',
            date:  '1/6/2020',
            status: "RECEIVED",
          },
          {
            name: 'Imaani Plant',
            type: 'Document',
            request: 'Contract number - 212341',
            date:  '1/2/2020',
            status: 'AWAITING',
          },
          {
            name: 'Jaskaran Britt',
            type: 'Document',
            request: 'Investment memos',
            date:  '1/6/2020',
            status: "RECEIVED",
          },
          {
            name: 'Octavia Kaye',
            type: 'Document',
            request: 'legal document n-321',
            date:  '1/3/2020',
            status: "RECEIVED",
          },
          {
            name: 'Umayr Maldonado',
            type: 'Document',
            request: 'contracts',
            date:  '1/6/2020',
            status: "RECEIVED",
          },
          {
            name: 'Halle Charles',
            type: 'Info',
            request: 'All contracts that you have',
            date:  '1/2/2020',
            status: "COMPLETE",
          },
          {
            name: 'Sapphire Arnold',
            type: 'Document',
            request: 'contracts',
            date:  '1/1/2020',
            status: "PENDING",
          },
          {
            name: 'Umayr Maldonado',
            type: 'Info',
            request: 'Financial memos, contracts, etc',
            date:  '1/6/2020',
            status: "RECEIVED",
          },
          {
            name: 'Kevin Frey',
            type: 'Document',
            request: 'Contracts financial and legal documents, investment memos,etc',
            date:  '1/6/2020',
            status: "PENDING",
          },
        ],
      editMode: 'Create',    
      name: '',
      preservedName: '',
      user_id: null,
      users: [],
      user_ids: [],
      editDescriptionMode: false,
      description: '',
      preservedDescription: '',

      tradeName: '',
      tradeDescription: '',
      tradeDialog: false,
      tradeEditMode: 'Create',
      tradeSearch: '',
      activeTrade: {},

      transactionName: '',
      transactionDescription: '',
      transactionTrade: null,
      transactionDialog: false,
      transactionEditMode: 'Create',
      transactionSearch: '',
      activeTransaction: {},

      topicTypeName: '',
      topicTypeDescription: '',
      topicTypeDialog: false,
      topicTypeEditMode: 'Create',
      topicTypeSearch:'',
      activeTopicType: {},
      topicTypeTab: null,
      topicTypeTemplate: '',
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


      userDialog: false,
      userEditMode: 'Add',
      username: '',
      useremail: '',
      emailRules: [ v => /.+@.+/.test(v) || 'Invalid Email address' ],
      userRole: 'provider admin',
      userRoles: ['provider admin', 'provider analyst', 'client manager', 'client analyst', 'participant'],
      activeUser: null,

      informationDialog: false,
      informationSubject: '',
      informationBody: '',
      clients: [],
      informationClient: null,
      
     
      documentDialog: false,
      documentSubject: '',
      documentBody: '',
      documents: [],
      documentClient: null,

      fileDialog: false,
      files: [],
      documentTypes: ["Fund - Financial","Fund - Memo", "Investment - Financial", "Investment - Legal",
        "Investment - Memo", "Investment - Value Model"],
      selectedDocumentTypes: [],
      documentTransactions: [],
      selectedDocumentTransactions: [],
      documentTrades: [],
      selectedDocumentTrades: [],
      uploadSet: null,
      filesToProcess: 0,
      uploading: false,

      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
          // The configuration of the editor.
      }

    }
  },
  mounted() {
    this.user_id = this.user.entity_id
    if (this.id !== 'new') {
      this.editMode = 'Edit'
      this.$store.commit('setActiveProject', {user_id: this.user_id})
      this.$store.dispatch('getProject', this.id)
      this.$store.dispatch('loadTrades', this.id)
      this.$store.dispatch('loadTransactions', this.id)
      this.$store.dispatch('loadTopicTypes', this.id)
      this.$store.dispatch('loadTopics', this.id)
    } else {
      this.$store.commit('setActiveProject', {user_id: this.user_id})
    }    
  },
  computed: {
    ...mapGetters(['activeProject', 'user', 'trades', 'transactions', 'topic_types','topics', 'searchLastPayload', 'activeProjectIsLoading']),
      filteredTrades() {
        return this.trades.filter(trade => {
              
             return trade.name.toLowerCase().indexOf(this.tradeSearch.toLowerCase()) > -1
        })
      },

       filteredTransactions() {
        return this.transactions.filter(transaction => {
              
             return transaction.name.toLowerCase().indexOf(this.transactionSearch.toLowerCase()) > -1
        })
      },

      filteredTopicTypes() {
        return this.topic_types.filter(topic_type => {
              
             return topic_type.name.toLowerCase().indexOf(this.topicTypeSearch.toLowerCase()) > -1
        })
      },
      filteredTopics() {
        return this.topics.filter(topic => {
              
             return topic.name.toLowerCase().indexOf(this.topicSearch.toLowerCase()) > -1
        })
      },

    selectedTradeList () {
      return this.selectedDocumentTrades.join()
    },
    selectedTransactionList () {
      return this.selectedDocumentTransactions.join()
    },
    selectedDocumentTypeList () {
      return this.selectedDocumentTypes.join()
    },

  },
  methods: {
    async saveProject() {
      var _this = this;
      if (this.users.length == 0){
        this.users = [{
          'user_id': this.user_id,
          'name': this.user.name,
          'role': 'provider admin'
        },]
      }

      if (this.user_ids.length == 0) {
        this.user_ids = [this.user_id,]
      }
      this.setValues(this, this.activeProject)

      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        
        if (!project['error'] && window.location.pathname != '/Projecteditor/' + project.entity_id ) {
          _this.$router.push('/Projecteditor/' + project.entity_id)
          _this.editMode = 'Edit'
          
        }
      })

    },
    setValues(source, destination) {      
      destination['version'] = source['version']
      if (source['id'] !== 'new') {
        destination['entity_id'] = source['id']
      }     
      destination['name'] = source['name']
      destination['user_id'] = source['user_id']
      destination['users'] = source['users']
      destination['user_ids'] = source['user_ids']
      destination['description'] = source['description']
    },
    addTrade() {
      this.activeTrade = {
        'project_id': this.id
      }
      this.tradeName = ''
      this.tradeDescription = ''
      this.tradeEditMode = 'Create'
      this.tradeDialog = true
    },    
    editTrade(trade) {
      this.activeTrade = trade
      this.tradeName = trade['name']
      this.tradeDescription = trade['description']
      this.tradeEditMode = 'Edit'
      this.tradeDialog = true
    },
    deleteTrade(id) {
      this.$store.dispatch('deleteTrade', id)
    },
    async saveTrade() {    
      this.tradeDialog = false
      await this.$store.dispatch('saveTrade', this.activeTrade).then(function (trade) {
        if (!trade['error']) {
           // Why do we redirecting to the same page on trade save? 
          // window.location = '/Projecteditor/' + trade.project_id
        }
      })
    },
    addTransaction() {
      this.activeTransaction = {
        'project_id': this.id
      }
      this.transactionName = ''
      this.transactionDescription = ''
      this.transactionTrade = null
      this.transactionEditMode = 'Create'
      this.transactionDialog = true
    },
    editTransaction(transaction) {
      this.activeTransaction = transaction
      this.transactionName = transaction['name']
      this.transactionDescription = transaction['description']
      this.transactionTrade = null
      for(let i = 0; i < this.trades.length; i ++){
        let trade = this.trades[i]
        if(trade.entity_id == transaction['trade_id']){
          this.transactionTrade = trade
        }
      }
      this.transactionEditMode = 'Edit'
      this.transactionDialog = true
    },
    async saveTransaction() {
      this.transactionDialog = false
      await this.$store.dispatch('saveTransaction', this.activeTransaction).then(function (transaction) {
        if (!transaction['error']) {
          // Why do we redirecting to the same page on transaction save? 

          // window.location = '/Projecteditor/' + transaction.project_id
        }
      })  
    },
    deleteTransaction(id) {
      this.$store.dispatch('deleteTransaction', id)
    },
    transactionTradeChanged(trade) {
      this.activeTransaction['trade_id'] = trade['entity_id']
    },    

    addTopicType() {
      this.topicTypeEditMode = 'Create'
      this.topicTypeDialog = true

      this.activeTopicType = {
        'project_id': this.id
      }
      this.topicTypeName = ''
      this.topicTypeDescription = ''        
      this.topicTypeTemplate = ''
      this.topicTypeVariables = [
        {
          name: '',
          description: '',
          data_type: '',
          example_value: '',
          edit: true
        },
      ]
      this.activeTopicTypeVariable = {}
    },

    editTopicType(topicType) {
      this.topicTypeEditMode = 'Edit'
      this.topicTypeDialog = true

      Object.assign(this.activeTopicType, topicType)      
      this.topicTypeName = topicType['name']
      this.topicTypeDescription = topicType['description']     
      this.topicTypeVariables = topicType['variables']
      this.topicTypeVariables.push(
        {
          name: '',
          description: '',
          data_type: '',
          example_value: '',
          edit: true
        }
      )
      this.activeTopicTypeVariable = {}
      this.topicTypeTemplate = topicType['template']
    },
    deleteTopicType(id) {
      this.$store.dispatch('deleteTopicType', id)
    },
    saveTopicType() {    
      this.topicTypeDialog = false

      this.activeTopicType['name'] = this.topicTypeName
      this.activeTopicType['description'] = this.topicTypeDescription
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        delete this.topicTypeVariables[i].edit
        if(this.topicTypeVariables[i].name == ''){
          this.topicTypeVariables.splice(i, 1)
        }
      }
      this.activeTopicType['variables'] = this.topicTypeVariables
      this.activeTopicType['template'] = this.topicTypeTemplate

      this.$store.dispatch('saveTopicType', this.activeTopicType)
    },
    cancelTopicType() {
      this.topicTypeDialog=false
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        delete this.topicTypeVariables[i].edit
        if(this.topicTypeVariables[i].name == ''){
          this.topicTypeVariables.splice(i, 1)
        }
      }
    },
    addTopicTypeVariable() {
      if(this.activeTopicTypeVariable.name && this.activeTopicTypeVariable.data_type){
        
        this.activeTopicTypeVariable.edit = false
        this.topicTypeVariables.splice(this.topicTypeVariables.length-1, 0, this.activeTopicTypeVariable)
        this.activeTopicTypeVariable = {}
      }
      
    },

    clearTopicTypeVariable() {
      this.activeTopicTypeVariable = {}
    },
    editTopicTypeVariable(variable) {      
      Object.assign(this.activeTopicTypeVariable, variable) 

      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].name == variable.name){          
          this.topicTypeVariables[i].edit = true
        }
        else {
          this.topicTypeVariables[i].edit = false
        }
      }
    },

    deleteTopicTypeVariable(variable) {
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].name == variable.name){
          this.topicTypeVariables.splice(i, 1)
        }
      }
      
    },

    saveTopicTypeVariable(variable) {
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].name == variable.name){
          Object.assign(this.topicTypeVariables[i], this.activeTopicTypeVariable) 
          this.topicTypeVariables[i].edit = false
        }
      } 
      this.topicTypeVariables[this.topicTypeVariables.length-1].edit = true
      this.activeTopicTypeVariable = {}
    },

    cancelTopicTypeVariable(variable) {      
      for(let i = 0; i < this.topicTypeVariables.length; i ++){
        if(this.topicTypeVariables[i].id == variable.id){
          this.topicTypeVariables[i].edit = false
        }
      }
      this.topicTypeVariables[this.topicTypeVariables.length-1].edit = true
      this.activeTopicTypeVariable = {}
    },

    addTopic() {
      this.topicEditMode = 'Create'
      this.topicDialog = true

      this.activeTopic = {
        'project_id': this.id,
        'snippet_ids': []
      }
      this.topicName = ''
      this.topicDescription = ''      
      this.topicVariables = {}
    },    

    editTopic(topic) {
      this.topicEditMode = 'Edit'
      this.topicDialog = true

      Object.assign(this.activeTopic, topic) 
      this.topicName = topic['name']
      this.topicTrade = topic['trade']
      this.topicTransaction = topic['transaction']
      this.topicDocumentType = topic['document']
      this.topicTemplate = topic['template']
      this.topicSnippetsIds = topic['snippet_ids']      

      
      for(let i = 0; i < this.topic_types.length; i++){
        if (topic['topic_type_id'] == this.topic_types[i].entity_id){
          Object.assign(this.selectedTopicType, this.topic_types[i])
          
        }
      }
      
      this.topicVariables = topic['variables']  
    },

    deleteTopic(id) {
      this.$store.dispatch('deleteTopic', id)
    },

    saveTopic() {    
      this.topicDialog = false

      let topic = Object.assign({}, this.activeTopic)
      topic['topic_type_id'] = this.selectedTopicType.entity_id
      topic['name'] = this.topicName
      topic['trade'] = this.topicTrade
      topic['transaction'] = this.topicTransaction
      topic['document'] = this.topicDocumentType
      topic['template'] = this.topicTemplate      

      let variables = []
      for(let i = 0;i < this.topicVariables.length; i++){
        let variable = {
          'name': this.topicVariables[i].name,
          'data_type': this.topicVariables[i].data_type,
          'value': this.topicVariables[i].value,
        }
        variables.push(variable)
      }
      topic['variables'] = variables

      this.$store.dispatch('saveTopic', topic)
    },
    addUser() {
      this.userDialog = true
      this.activeUser = {}
      this.username = ''
      this.useremail = ''
      this.userEditMode = 'Add'
    },
    editUser(user) {
      this.userDialog = true
      this.activeUser = user
      this.username = user.name
      this.userRole = user.role
      this.userEditMode = 'Edit'
    },
    editDescription() {
      this.editDescriptionMode = true;
      const theElement = this.$refs.description.$el
      this.preservedName = this.name
      this.preservedDescription = this.description
      const input = theElement.querySelector('input:not([type=hidden]),textarea:not([type=hidden])')
       if (input) {
            setTimeout(() => {
              input.focus()
            }, 0)
          }
    },
    editDescriptionOff(revert) {
      if (revert) {
        this.description = this.preservedDescription
        this.name =  this.preservedName
      }
      this.editDescriptionMode = false;
    },
    
    async deleteUser(user_id) {
      
      for(let i=0; i < this.activeProject.users.length; i++){
          let user = this.activeProject.users[i]
          if(user.user_id == user_id){
            this.activeProject.users.splice(i, 1)
          }
        }

      for(let i=0; i < this.activeProject.user_ids.length; i++){
          if(user_id == this.activeProject.user_ids[i]){
            this.activeProject.user_ids.splice(i, 1)
          }
        }
      
      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error']) {
          window.location = '/Projecteditor/' + project.entity_id
        }
      })
    },
    userRoleChanged() {
      
    },
    async saveUser() {
      if(this.userEditMode === 'Add'){
          let user = {
            'user_id': null,
            'name': this.username,
            'email': this.useremail,
            'role': this.userRole
          }
          this.activeProject.users.push(user)
      }
      else {
        for(let i=0; i < this.activeProject.users.length; i++){
          let user = this.activeProject.users[i]
          if((user.user_id == this.activeUser.user_id) && (user.role != this.activeUser.role)){
            this.activeProject.users[i].role = this.activeUser.role
          }
        }
      }
      
      this.userDialog = false
      await this.$store.dispatch('saveProject', this.activeProject).then(function (project) {
        if (!project['error']) {
          window.location = '/Projecteditor/' + project.entity_id
        }
      })        
    },
    onRequestInformation(){
      this.informationSubject = this.name + ' Information Request'
      this.informationDialog = true
    },
    onSaveInformation() {
      const payload = {
        'subject': this.informationSubject,
        'project_id': this.activeProject.entity_id,
        'project_name': this.activeProject.name,
        'body': this.informationBody,
        'user_id': this.informationClient.user_id,
        'user_name': this.informationClient.name
      }

      this.$store.dispatch('saveRequestInformation', payload)
      this.informationDialog = false
    },
    onRequestDocument(){
      this.documents = []
      this.documentSubject = this.name + ' Document Request'
      this.documentDialog = true
    },
    onSaveDocument() {
      let document_list = {}
      for(let i = 0; i < this.documents.length; i ++){
        document_list[this.documents[i]] = 'requested'
      }
      const payload = {
        'subject': this.documentSubject,
        'project_id': this.activeProject.entity_id,
        'project_name': this.activeProject.name,
        'body': this.documentBody,
        'documents': document_list,
        'user_id': this.documentClient.user_id,
        'user_name': this.documentClient.name
      }

      this.$store.dispatch('saveRequestDocument', payload)
      this.documentDialog = false
    },


    onUploadFile() {
      this.fileDialog = true;
    },
    queuecomplete() {
      if (this.uploading) {
        this.files = this.$refs.dropzone.dropzone.getAcceptedFiles();
        this.$store.dispatch('loadDocuments', {
          ...this.searchLastPayload,
          project_id: this.activeProject.entity_id
        });
        this.cancelUpload()
      }
    },
    async uploadFiles () {
      let files = this.$refs.dropzone.dropzone.files;
      if (files.length === 0) return;
      const now = new Date();
      let newUploadSet = {
        'start_time_utc': moment.utc(now).format(),
        'start_time_local': moment(now).format()
      };
      if (this.$route.params.id) newUploadSet['project_id'] = this.$route.params.id;
      newUploadSet['files'] = files.map(file => {return file['name']});
      newUploadSet['user_id'] = this.user.user_id;
      await this.saveUploadSet(newUploadSet);
      this.setFileUrls();
      this.uploading = true;
    },
    async saveUploadSet(uploadSet){
      await this.$store.dispatch('uploadDocumentFiles', uploadSet).then(res => {
        this.uploadSet = res;
      });
    },
    setFileUrls() {
      const fileCount = this.$refs.dropzone.dropzone.files.length;
      this.filesToProcess = fileCount;
      for (let i = 0; i < fileCount; i++) {
        this.setFileUrl(this.$refs.dropzone.dropzone.files[i], this.checkForUpload)
      }
    },
    setFileUrl(file, done) {
      const payload = {
        'fileName': file.name,
        'fullPath': file.fullPath || file.name,
        'contentType': file.type,
        'Transactions': this.selectedTransactionList,
        'DocumentTypes': this.selectedDocumentTypeList,
        'Trades': this.selectedTradeList,
        'UserID': this.user.user_id,
        'ProjectID': this.$route.params.id,
        'UploadSetID': this.uploadSet ? this.uploadSet.entity_id : null
      };
      this.$store.dispatch('getSignedURL', payload)
        .then(url => {
          file.uploadURL = url.signed_url;
          if (done) done()
        })
        .catch(err => {
          if (done) done("Failed to get an S3 signed upload URL", err)
        })
    },
    checkForUpload() {
      this.filesToProcess--;
      if (this.filesToProcess < 1) {
        this.$refs.dropzone.dropzone.processQueue()
      }
    },
    cancelUpload () {
      this.fileDialog = false;
      this.selectedDocumentTypes = '';
      this.selectedDocumentTransactions = '';
      this.selectedDocumentTrades = '';
      this.$refs.dropzone.dropzone.removeAllFiles(true);
      this.uploading = false
    },
  },
  watch: {
    activeProject() {      
      if(this.activeProject) {
        this.name = this.activeProject.name
        this.user_id = this.activeProject.user_id
        this.description = this.activeProject.description
        if(this.activeProject.users == undefined ){
          this.activeProject.users = []
          this.users = []
        }
        else {
          this.users = this.activeProject.users
        }

        this.clients = []
        for( let i = 0; i < this.activeProject.users.length; i ++) {
          const user = this.activeProject.users[i]    
          if(user.role == 'client manager' || user.role == 'client analyst' || user.role == 'participant'){
            this.clients.push(user)
          }
        }

        if(this.activeProject.user_ids == undefined ){
          this.activeProject.user_ids = []
          this.user_ids = []
        }
        else {
          this.user_ids = this.activeProject.user_ids
        }
      }
    },
    trades() {

    },
    transactions () {

    },
    tradeName() {
      this.activeTrade['name'] = this.tradeName
    },
    tradeDescription() {
      this.activeTrade['description'] = this.tradeDescription
    },
    transactionName() {
      this.activeTransaction['name'] = this.transactionName
    },
    transactionDescription() {
      this.activeTransaction['description'] = this.transactionDescription
    },
    userRole() {
      this.activeUser.role = this.userRole
    },
    documents() {
      this.documentBody = 'Please provide the following documents:' + this.documents.join(',')

    },
    selectedTopicType() {
      if(this.selectedTopicType){
        this.topicName = this.selectedTopicType.name + ' for ' + this.topicTransaction
        this.topicTemplate = this.selectedTopicType.template

        this.topicVariables = []
        for(let i = 0; i < this.selectedTopicType.variables.length; i++){
          let variable_type = this.selectedTopicType.variables[i]
          let variable = {
            'name': variable_type.name,
            'data_type':variable_type.data_type,
            'place_holder': 'ex: ' + variable_type.example_value,
            'value': ''
          }
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
<style>
.topictype-table {
  border-collapse: collapse;
}
.topictype-table th, .topictype-table td {
  border: 1px solid black;
}
</style>