<template>
  <v-row class="mb-6">
    <Description />
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
  }
}
</script>

<style scoped>

</style>