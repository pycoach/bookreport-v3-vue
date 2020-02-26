<template>
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
          <v-toolbar-title>Snippets</v-toolbar-title>
          <v-spacer />
        </v-app-bar>
          <div class="snippets-list__content">
            <template v-if="snippets.length && !isLoadingSheetData">
              <SnippetItem
                v-for="snippet in snippets"
                :key="snippet.cell1 + snippet.cell2"
                :snippet="snippet"
                @handleDelete="deleteSnippet($event)"
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
      </v-card>
    </div>
  </v-scroll-x-transition>
</template>

<script>
import {mapState} from "vuex";
import SnippetItem from './WorkSheet/SnippetListItem'
export default {
  name: 'WorkSheetSnippetsList',
  props: ['snippets'],
  components: {
    SnippetItem
  },
  computed: {
    ...mapState('ExcelServices', ['showSnippetsList', 'isLoadingSheetData'])
  },
  methods: {
    toggleList () {
      this.$store.commit('ExcelServices/TOGGLE_SNIPPETS_LIST')
    },
    deleteSnippet (entityId) {
      this.$emit('handleDelete', entityId)
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