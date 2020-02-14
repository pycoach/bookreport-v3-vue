<template>
  <div>
    <SnippetItem v-for="(snippet, index) in snippetList" :key="snippet.entity_id" :item="snippet" />
  </div>
</template>

<script>
import SnippetItem from './SnippetItem';
export default {
  name: 'SnippetsList',
  props: ['snippets'],
  components: {
    SnippetItem
  },
  data () {
    return {
      snippetList: []
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