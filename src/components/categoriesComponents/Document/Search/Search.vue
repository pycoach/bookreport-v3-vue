<template>
  <v-layout wrap>
    <v-row>
      <v-col md="12" xs="12">
        <v-card>
          <v-toolbar>
            <v-card-title class="headline d-flex justify-space-between">
              <template v-if="searchType === 'basic'">Basic</template>
              <template v-else-if="searchType === 'advanced'">Advanced</template>
              Search
              <div class="ml-3">
                <v-btn
                  depressed 
                  text 
                  color="primary" 
                  class="font-weight-bold"
                  v-if="searchType !== 'basic'"
                  @click="onTypeChange('basic')"
                >
                  Go to Basic Search
                </v-btn>
                <v-btn 
                  depressed
                  text
                  color="primary" 
                  class="font-weight-bold"
                  v-else-if="searchType !== 'advanced'"
                  @click="onTypeChange('advanced')"
                >
                  Go to Advanced Search
                </v-btn>
              </div>
            </v-card-title>
          </v-toolbar>
          <v-container grid-list-xl fluid >
            <transition name="fade" mode="out-in">
              <AdvancedSearch v-if="searchType === 'advanced'" />
              <BasicSearch v-else-if="searchType === 'basic'" />
            </transition>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import AdvancedSearch from './AdvancedSearch';
import BasicSearch from './BasicSearch';
import {mapGetters} from 'vuex';
export default {
  name: 'Search',
  components: {
    AdvancedSearch,
    BasicSearch
  },
  computed: {
    ...mapGetters('ProjectDocuments', ['searchType'])
  },
  methods: {
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