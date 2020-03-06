<template>
  <div>
    <snippet-list-item 
      v-for="snippet in snippetList" 
      :key="snippet.entity_id + snippet.x + snippet.y + snippet.width + snippet.height" 
      :item="snippet"
      :deletingSnippetIds="deletingSnippets"
    />
    <topic-view-dialog />
  </div>
</template>

<script>
import SnippetListItem from './SnippetListItem';
import {mapGetters} from "vuex";
export default {
  name: 'SnippetsList',
  props: ['snippets', 'deletingSnippets'],
  components: {
    SnippetListItem,
    'topic-view-dialog': () => import('../DocumentSnippetTopics/TopicViewDialog')
  },
  data () {
    return {
      snippetList: []
    }
  },
  computed: {
    ...mapGetters(['topics'])
  },
  mounted () {
    if (!this.topics.length) {
      this.requestTopics()
    }
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