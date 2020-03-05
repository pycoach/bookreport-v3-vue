<template>
  <v-list-group
    class="snippets-group"
    :ripple="false"
    append-icon=""
    no-action
    :disabled="isDeleting"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <template v-slot:activator>
      <v-list-item-avatar>
        <v-icon class="grey lighten-1 white--text">bookmark</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="snippet.sheet_name"></v-list-item-title>
        <v-list-item-subtitle v-text="`${snippet.cell1} - ${snippet.cell2}`"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          :disabled="isDeleting"
        >
          <v-icon color="lighten-1">bookmark</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action class="ma-0">
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
    </template>
    <snippet-topics :snippet-id="snippet.entity_id" />
  </v-list-group>
</template>

<script>

export default {
  name: 'SnippetListItem',
  props: ['snippet'],
  components: {
    'snippet-topics': () => import('./Topics')
  },
  data: () => ({
    isDeleting: false
  }),
  methods: {
    deleteSnippet (entityId) {
      this.isDeleting = true;
      const payload = {
        entity_id: entityId
      };
      this.$store.dispatch('WorkSheet/deleteSnippets', payload).then(() => {
        this.$emit('handleDelete', entityId)
      }).finally(() => {
        this.isDeleting = false
      })
    }
  }
}
</script>

<style lang="scss">
  .snippets-group {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    &:last-child {
      border-bottom: none;
    }
    .v-list-item--active::before {
      background: currentColor;
      opacity: 0.16;
    }
    &.v-list-group--active {
      background-color: rgba(0, 0, 0, 0.04);
    }
    .v-tabs-items {
      background: transparent;
    }
    .v-item-group {
      overflow-y: hidden;
    }
    .v-tab {
      font-size: 0.7rem;
      font-weight: 600;
      align-items: center !important;
      padding: 12px;
    }
    .v-slide-group__next, .v-slide-group__prev {
      flex: 0 1 35px;
      min-width: 35px;
    }
    .v-alert {
      font-weight: 500;
      font-size: 13px;
    }
  }
</style>