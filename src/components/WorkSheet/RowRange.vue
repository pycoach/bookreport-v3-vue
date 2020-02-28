<template>
  <v-dialog
    v-model="show"
    width="500"
  >
    <v-card>
      <v-card-title class="headline">Choose Rows to Display</v-card-title>
        <v-container grid-list-xl fluid >
        <v-radio-group 
          :value="rowMode"
          @change="handleChange"
        >
          <v-radio
            label="First and Last"
            color="primary"
            :value="1"
          />
          <v-radio
            label="All Rows"
            color="primary"
            :value="2"
          />
          <v-radio
            label="Range"
            color="primary"
            :value="3"
          />
        </v-radio-group>
        <v-scroll-y-transition>
          <template v-if="newRowMode === 1">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="first"
                  label="Show first"
                  type="number"
                  hint="rows"
                  persistent-hint
                />
              </v-col>
              <v-col cols="4" offset="4">
                <v-text-field
                  v-model="last"
                  label="Show last"
                  type="number"
                  hint="rows"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </template>
          <template v-else-if="newRowMode === 3">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="range"
                  label="Range"
                  hint="B4:D12"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </template>
        </v-scroll-y-transition>
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
import { EventBus } from '../EventBus'; 
export default {
  name: 'RowRange',
  props: ['rowMode', 'firstRows', 'lastRows'],
  data: () => ({
    show: false,
    newRowMode: null,
    first: 10,
    last: 10,
    range: null
  }),
  mounted () {
    EventBus.$on('toggleRowRangeDialog', () => {
      this.show = !this.show;
      this.newRowMode = this.rowMode;
      this.first = this.firstRows;
      this.last = this.lastRows
    })
  },
  methods: {
    handleChange (e) {
      this.newRowMode = e
    },
    submitChange () {
      this.show = false;
      this.$emit('change', {
        mode: this.newRowMode,
        firstRows: this.first,
        lastRows: this.last,
        range: this.range && this.range.toUpperCase()
      })
    }
  }
}
</script>

<style scoped>

</style>