<template>
  <div>
    <snippet-list-item 
      v-for="snippet in snippetList" 
      :key="snippet.entity_id + snippet.x + snippet.y + snippet.width + snippet.height" 
      :item="snippet"
      :deletingSnippetIds="deletingSnippets"
    />
  </div>
</template>

<script>
import SnippetListItem from './SnippetListItem';
export default {
  name: 'SnippetsList',
  props: ['snippets', 'deletingSnippets'],
  components: {
    SnippetListItem
  },
  data () {
    return {
      snippetList: []
    }
  },
  mounted () {
    this.requestTopics()
  },
  methods: {
    requestTopics () {
      this.$store.dispatch('loadTopics', this.$route.params.project_id)
    }
  },
  watch: {
    snippets: function () {
      let list = this.snippets.slice();
      function compare (a, b) {
        let comparison = 0
        if (a.page_index > b.page_index) {
          comparison = 1
        } else if (a.page_index < b.page_index) {
          comparison = -1
        }
        if (comparison === 0) {
          if (a.y > b.y) {
            comparison = 1
          } else if (a.y < b.y) {
            comparison = -1
          }
        }
        return comparison
      }
      list.sort(compare);
      this.snippetList = [];
      this.snippetList = list
    }
  }
}
</script>

<style scoped>

</style>