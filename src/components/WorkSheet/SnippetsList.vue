<template>
  <div>
    <v-scroll-x-transition>
      <div class="snippets-list" :class="{'show': showSnippetsList}">
        <v-card
          max-width="400"
          class="mx-auto"
        >
          <v-app-bar
            dark
            color="default"
          >
            <v-app-bar-nav-icon @click="toggleList" />
            <v-toolbar-title>
              Snippets 
              <template v-if="processing">
                <i>Adding</i>
                <v-progress-circular width="2" color="white" indeterminate size="20" class="ml-3" />
              </template>
            </v-toolbar-title>
            <v-spacer />
          </v-app-bar>
          <v-list>
            <div class="snippets-list__content">
              <template v-if="snippets.length && !isLoadingSheetData">
                <snippet-list-item
                  v-for="(snippet, index) in snippets"
                  :key="snippet.cell1 + snippet.cell2 + index"
                  :snippet="snippet"
                  @handleDelete="deleteSnippet"
                  @mouseenter="$emit('mouseenter', { from: snippet.cell1, to: snippet.cell2 })"
                  @mouseleave="$emit('mouseleave', { from: snippet.cell1, to: snippet.cell2 })"
                />
              </template>
              <template v-else-if="isLoadingSheetData">
                <v-skeleton-loader
                  v-for="_ in 5"
                  :key="Math.random(0, 999)"
                  loading
                  type="list-item-avatar-two-line"
                  class="snippet-skeleton mx-0"
                />
              </template>
              <template v-else-if="!snippets.length && !isLoadingSheetData">
                <div class="text-center mt-5">
                  <v-icon>work_off</v-icon>
                  <p>Snippets not found</p>
                </div>
              </template>
            </div>
          </v-list>
        </v-card>
      </div>
    </v-scroll-x-transition>
    <view-topic-dialog />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SnippetListItem from './SnippetListItem'
export default {
  name: 'WorkSheetSnippetsList',
  props: ['snippets', 'processing'],
  components: {
    'snippet-list-item': SnippetListItem,
    'view-topic-dialog': () => import('./ViewTopic')
  },
  computed: {
    ...mapState('WorkSheet', ['showSnippetsList', 'isLoadingSheetData']),
  },
  mounted () {
    this.requestTopics()
  },
  methods: {
    toggleList () {
      this.$store.commit('WorkSheet/TOGGLE_SNIPPETS_LIST')
    },
    deleteSnippet (entityId) {
      this.$emit('handleDelete', entityId)
    },
    requestTopics () {
      this.$store.dispatch('loadTopics', this.$route.params.project_id)
    }
  }
}
</script>

<style lang="scss">
  $width: 290px;
  .snippets-list {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: $width;
    background: #fff;
    box-shadow: 3px 4px 41px rgba(0, 0, 0, 0.06);
    z-index: 2;
    transition: 0.2s;
    transform: translateX($width);
    &.show {
      visibility: visible;
      transform: translateX(0);
    }
    &__content {
      height: calc(100vh - 71px);
      overflow: auto;
    }
    .v-card {
      &:after {
        display: none;
      }
      header {
        border-radius: 0 !important;
        border-color: #333;
      }
    }
    .snippet-skeleton {
      height: 61px;
    }
  }
</style>