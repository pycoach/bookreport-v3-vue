<template>
  <div>
    <div v-for="snippet in snippets" :key="snippet.entity_id" class="snippet-item">
      <SnippetItem :item="snippet" />
    </div>
  </div>
</template>

<script>
import SnippetItem from './SnippetItem';
export default {
  name: 'SnippetsList',
  components: {
    SnippetItem
  },
  props: {
    snippets: {
      type: [Array, Object],
      default: null
    }
  }
}
</script>

<style scoped>

</style>