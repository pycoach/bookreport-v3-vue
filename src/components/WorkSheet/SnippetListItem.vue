<template>
  <v-list-item 
    :disabled="isDeleting" 
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <v-list-item-avatar>
      <v-icon class="grey lighten-1 white--text">bookmark</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="snippet.sheet_name"></v-list-item-title>
      <v-list-item-subtitle v-text="`${snippet.cell1} - ${snippet.cell2}`"></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        color="error"
        icon
        :disabled="isDeleting"
        :loading="isDeleting"
        @click="deleteSnippet(snippet.entity_id)"
      >
        <v-icon color="lighten-1">delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: 'SnippetListItem',
  props: ['snippet'],
  data: () => ({
    isDeleting: false
  }),
  methods: {
    deleteSnippet (entityId) {
      this.isDeleting = true;
      const payload = {
        entity_id: entityId
      };
      this.$store.dispatch('ExcelServices/deleteSnippets', payload).then(() => {
        this.$emit('handleDelete', entityId)
      }).finally(() => {
        this.isDeleting = false
      })
    }
  }
}
</script>

<style scoped>

</style>