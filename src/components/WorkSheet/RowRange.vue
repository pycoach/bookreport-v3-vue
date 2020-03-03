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
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="first"
                    label="Show first"
                    type="number"
                    hint="rows"
                    :rules="firstRowsRules"
                    persistent-hint
                    @focus="focusOn('first')"
                    @input="validate"
                  />
                </v-col>
                <v-col cols="4" offset="4">
                  <v-text-field
                    v-model="last"
                    label="Show last"
                    type="number"
                    hint="rows"
                    :rules="lastRowsRules"
                    persistent-hint
                    @focus="focusOn('last')"
                    @input="validate"
                  />
                </v-col>
              </v-row>
            </v-form>
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
          :disabled="!valid && newRowMode === 1"
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
  props: ['rowMode', 'rowsCount', 'firstRows', 'lastRows'],
  data: () => ({
    valid: true,
    show: false,
    newRowMode: null,
    first: 10,
    last: 10,
    range: null,
    focusedOn: null
  }),
  computed: {
    firstRowsRules () {
      let rules = [];
      const maxCount =
        v => (Number(v) || '') <= this.rowsCount ||
          `You have reached the maximal rows count`;
      rules.push(maxCount);
      const isPositive =
        v => (Number(v) || '') > -1 ||
          `Rows count must be positive number`;
      rules.push(isPositive);
    
      if (this.focusedOn !== 'first') return rules;
      const availableCount =
        v => (Number(v) || '') < this.rowsCount - this.last + 1 ||
          `${this.rowsCount - this.last} Row are available for first`;
      rules.push(availableCount);
    
      if (this.rowsCount - this.last <= 0) {
        rules = []
      }
      return rules
    },
    lastRowsRules () {
      let rules = [];
      const maxCount =
        v => (Number(v) || '') <= this.rowsCount ||
          `You have reached the maximal rows count`;
      rules.push(maxCount);
      const isPositive =
        v => (Number(v) || '') > -1 ||
          `Rows count must be positive number`;
      rules.push(isPositive);
    
      if (this.focusedOn !== 'last') return rules;
      const availableCount =
        v => (Number(v) || '') < this.rowsCount - this.first + 1 ||
          `${this.rowsCount - this.first} Row are available for last`;
      rules.push(availableCount);
    
      if (this.rowsCount - this.first <= 0) {
        rules = []
      }
      return rules
    }
  },
  mounted () {
    EventBus.$on('toggleRowRangeDialog', () => {
      this.show = !this.show;
      this.newRowMode = this.rowMode;
      this.first = this.firstRows;
      this.last = this.lastRows
    })
  },
  methods: {
    focusOn (e) {
      this.focusedOn = e;
    },
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
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