<template>
  <v-row class="mb-6">
    <Description @onSave="emitDescriptionSave($event)" />
    <Request />
  </v-row>
</template>

<script>
import Description from './Description';
import Request from './Request';
export default {
  name: 'Overview',
  components: {
    Description,
    Request
  },
  methods: {
    emitDescriptionSave(e) {
      this.$emit('onSave', e);
    }
  }
}
</script>

<style scoped>

</style>