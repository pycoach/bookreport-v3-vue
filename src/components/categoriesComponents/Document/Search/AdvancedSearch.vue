<template>
  <v-form ref="form" @submit.prevent="true">
    <v-layout row wrap class="pa-2">
      <v-flex xs12 sm4>
        <v-text-field
          v-model="project"
          label="Project..."
          prepend-icon="search"
          :disabled="documentsLoading"
          @input="getDocuments"
        />
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="name"
          label="Name..."
          prepend-icon="search"
          :disabled="documentsLoading"
          @input="getDocuments"
        />
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="content"
          label="Content..."
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
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'AdvancedSearch',
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
  beforeDestroy() {
    this.resetForm()
  },
  computed: {
    ...mapGetters(['activeProject']),
    ...mapGetters('ProjectDocuments', ['documentsLoading']),
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
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped>

</style>