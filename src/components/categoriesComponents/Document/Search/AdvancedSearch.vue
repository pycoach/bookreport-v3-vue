<template>
  <v-layout row wrap class="pa-2">
    <v-flex xs12 sm3>
      <v-text-field
        v-model="project"
        label="Project..."
        prepend-icon="search"
        @input="getDocuments"
      />
    </v-flex>
    <v-flex xs12 sm3>
      <v-text-field
        v-model="name"
        label="Name..."
        prepend-icon="search"
        @input="getDocuments"
      />
    </v-flex>
    <v-flex xs12 sm3>
      <v-text-field
        v-model="content"
        label="Content..."
        prepend-icon="search"
        @input="getDocuments"
      />
    </v-flex>
    <v-flex xs12 sm3>
      <v-select
        v-model="tag"
        label="Tag..."
        prepend-icon="search"
        multiple
        tags
        @input="getDocuments"
        :items="tags"
      />
    </v-flex>
    <v-flex xs12 sm3>
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
          <v-btn text color="primary" @click="menuPickerStart = false">Cancel</v-btn>
          <v-btn text color="primary" @click="menuPickerStart = false">Save</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs12 sm3>
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
          <v-btn text color="primary" @click="menuPickerEnd = false">Cancel</v-btn>
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
      />
    </v-flex>
  </v-layout>
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
  beforeMount () {
    // Get Tags Before Mount
    // this.$store.dispatch("getTags")
  },
  computed: {
    ...mapGetters(['activeProject']),
    tags () {
      return [1, 2, 3, 4]
    }
  },
  methods: {
    getDocuments () {
      console.log('working');
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('loadDocuments', {
          project_id: this.activeProject.entity_id,
          Body: this.content,
          StartDate: this.searchStartDate,
          EndDate: this.searchEndDate,
          Name: this.name,
          Project: this.project,
          Tag: this.tag,
          IncludeArchive: this.searchIncludeArchive,
        });
      }, 300);
    }
  }
}
</script>

<style scoped>

</style>