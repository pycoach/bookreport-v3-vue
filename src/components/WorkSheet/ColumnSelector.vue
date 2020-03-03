<template>
  <v-dialog
    v-model="show"
    width="500"
  >
    <v-card>
      <v-card-title class="headline">Choose Columns to Display</v-card-title>
      <v-container grid-list-xl fluid>
        <v-checkbox 
          v-for="heading in headings"
          v-model="selected" 
          :label="heading"
          :value="heading"
          color="primary"
          class="ma-0"
        />
      </v-container>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="submitChange"
        >
          I accept
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {EventBus} from "../EventBus";

export default {
  name: 'ColumnSelector',
  props: ['headings'],
  data: () => ({
    show: false,
    selected: []
  }),
  mounted () {
    EventBus.$on('toggleColumnsDialog', () => {
      this.show = !this.show;
    })
  },
  created () {
    this.selected = this.headings
  },
  methods: {
    submitChange () {
      let excluded = [];
      this.headings.forEach((item) => {
        if (!this.selected.includes(item)) {
          excluded.push(item)
        }
      });
      this.$emit('onChange', excluded);
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>