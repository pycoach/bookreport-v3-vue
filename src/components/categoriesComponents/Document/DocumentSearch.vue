<template>
  <v-btn  v-if="searchType == 'hidden'"  class="mr-3 mb- 2 btn-white "
          @click="onTypeChange('advanced')">
          <img class="mr-3" src="../../../assets/search.svg" height="17px" alt="" />
          Advanced Search
  </v-btn>
  <v-layout v-else-if="searchType == 'advanced'" wrap>
    <v-row>
      <v-col md="12" xs="12">
        <v-card>
          <v-toolbar>
            <v-card-title class="headline d-flex justify-space-between">
              Advanced Search
              <div class="ml-3">
                  <v-btn
                    depressed 
                    text 
                    color="primary" 
                    class="font-weight-bold"
                    @click="resetForm"
                    :disabled="documentsLoading"
                  >
                   <i class="material-icons">refresh</i>
                    CLEAR SEARCH
                  </v-btn>

                  <v-btn
                  depressed 
                  text 
                  color="primary" 
                  class="font-weight-bold"
                  v-if="searchType !== 'hidden'"
                  @click="onTypeChange('hidden')"
                >
                  —
                </v-btn>
              </div>
            </v-card-title>
          </v-toolbar>
          <v-container grid-list-xl fluid >
              <v-form ref="formSearch" @submit.prevent="true">
                <v-layout row wrap class="pa-2">
                  <v-flex xs12 sm4>
                    <v-text-field
                      v-model="project"
                      label="Project"
                      prepend-icon="search"
                      :disabled="documentsLoading"
                      @input="getDocuments"
                    />
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field
                      v-model="name"
                      label="Name"
                      prepend-icon="search"
                      :disabled="documentsLoading"
                      @input="getDocuments"
                    />
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field
                      v-model="content"
                      label="Content"
                      prepend-icon="search"
                      :disabled="documentsLoading"
                      @input="getDocuments"
                    />
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-menu
                      ref="menuPickerStart"
                      v-model="menuPickerStart"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="searchStartDate"
                          label="Pick start date"
                          prepend-icon="event"
                          single-line readonly
                          v-on="on"
                          :disabled="documentsLoading"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="searchStartDate"
                        no-title
                        scrollable
                        actions
                        @change="getDocuments"
                      >
                        <v-btn text color="primary" @click="searchStartDate = ''">Clear</v-btn>
                        <v-btn text color="primary" @click="menuPickerStart = false">Save</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-menu
                      ref="menuPickerStart"
                      v-model="menuPickerEnd"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="searchEndDate"
                          label="Pick start date"
                          prepend-icon="event"
                          single-line readonly
                          v-on="on"
                          :disabled="documentsLoading"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="searchEndDate"
                        no-title
                        scrollable
                        actions
                        @change="getDocuments"
                      >
                        <v-btn text color="primary" @click="searchEndDate = ''">Clear</v-btn>
                        <v-btn text color="primary" @click="menuPickerEnd = false">Save</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex>
                    <v-checkbox
                      label="Include archive"
                      v-model="searchIncludeArchive"
                      color="primary"
                      hide-details
                      @change="getDocuments"
                      :disabled="documentsLoading"
                    />
                  </v-flex>
                </v-layout>
              </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'Search',
   data () {
    return {
      project: '',
      name: '',
      content: '',
      tag: '',
      searchStartDate: '',
      searchEndDate: '',
      menuPickerStart: false,
      menuPickerEnd: false,
      searchIncludeArchive: false,
      timer: null
    }
  },

  computed: {
    ...mapGetters('ProjectDocuments', ['searchType']),
    ...mapGetters('ProjectDocuments', ['documentsLoading']),
    ...mapGetters(['activeProject', 'user']),
    ...mapGetters('ProjectDocuments', ['searchOptions'])
  },

  methods: {
     getDocuments () {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('ProjectDocuments/loadDocuments', {
          project: this.project,
          name: this.name,
          body: this.content,
          start_date: this.searchStartDate,
          end_date: this.searchEndDate,
          include_archive: this.searchIncludeArchive,
          project_id: this.activeProject.entity_id,
        });
      }, 500);
    },

    resetForm () {
      this.$refs.formSearch.reset()
    },

    onTypeChange (newType) {
      this.$store.commit('ProjectDocuments/setSearchType', newType)
    }
  }
}

</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>