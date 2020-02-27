<template>
  <v-dialog
    v-model="show"
    width="500"
  >
    <v-card>
      <v-card-title class="headline">Choose Rows to Display</v-card-title>
      <v-radio-group 
        :value="rowMode"
        @change="handleChange($event)"
      >
        <v-radio
          label="First and Last"
          :value="1"
        />
        <v-radio
          label="All Rows"
          :value="2"
        />
        <v-radio
          label="Range"
          :value="3"
        />
      </v-radio-group>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
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
import { EventBus } from '../EventBus'; 
export default {
  name: 'RowRange',
  props: ['rowMode'],
  data: () => ({
    show: false,
    newRowMode: null
  }),
  mounted () {
    EventBus.$on('toggleRowRangeDialog', () => {
      this.show = !this.show
    })
  },
  methods: {
    handleChange (e) {
      this.newRowMode = e
    },
    submitChange () {
      this.show = false;
      this.$emit('change', this.newRowMode)
    }
  }
}
</script>

<style scoped>

</style>