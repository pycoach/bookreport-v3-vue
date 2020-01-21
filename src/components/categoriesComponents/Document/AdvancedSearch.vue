<template>
  <v-layout row wrap>
    <v-flex xs12 sm3>
      <v-text-field
        label="Project..."
        prepend-icon="search"
        @input="searchByProject"
      />
    </v-flex>
    <v-flex xs12 sm3>
      <v-text-field
        label="Name..."
        prepend-icon="search"
        @input="searchByName"
      />
    </v-flex>
    <v-flex xs12 sm3>
      <v-text-field
        label="Content..."
        prepend-icon="search"
        @input="searchByContent"
      />
    </v-flex>
    <v-flex xs12 sm3>
      <v-select
        label="Tag..."
        prepend-icon="search"
        multiple
        tags
        @input="searchByTag"
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
        full-width
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
        >
          <v-btn text color="primary" @click="menuPickerStart = false">Cancel</v-btn>
          <v-btn text color="primary">Save</v-btn>
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
        full-width
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="searchEndtDate"
            label="Pick start date"
            prepend-icon="event"
            single-line readonly
            v-on="on"
          >
          </v-text-field>
        </template>
        <v-date-picker
          v-model="searchEndtDate"
          no-title
          scrollable
          actions
        >
          <v-btn text color="primary" @click="menuPickerEnd = false">Cancel</v-btn>
          <v-btn text color="primary">Save</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "AdvancedSearch",
  data () {
    return {
      searchStartDate: null,
      searchEndDate: null,
      menuPickerStart: false,
      menuPickerEnd: false
    }
  },
  beforeMount () {
    // Get Tags Before Mount
    // this.$store.dispatch("getTags")
  },
  computed: {
    tags () {
      return [1, 2, 3, 4]
      // return this.organization.tags.map(tag => tag.Name)
    }
  },
  methods: {
    searchByProject(e) {
      console.log(e)
      // this.$store.dispatch('getProject', this.id)
    },
    searchByName(e) {
      console.log(e)
      // this.$store.dispatch('getProject', this.id)
    },
    searchByContent(e) {
      console.log(e)
      // this.$store.dispatch('getProject', this.id)
    },
    searchByTag(e) {
      console.log(e)
      // this.$store.dispatch('getProject', this.id)
    },
  }
}
</script>

<style scoped>

</style>