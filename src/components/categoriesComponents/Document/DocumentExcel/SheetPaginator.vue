<template>
  <tr @mouseenter="onMouseenter()" class="expand-tr">
    <td></td>
    <td class="expand-table-td">
      <v-form
        ref="form"
        v-model="valid"
      >
        ↑ First
        <v-text-field
          v-model="first"
          class="mx-4"
          type="number"
          ref="refFirstRows"
          :rules="firstRowsRules"
          :disabled="isFetching"
          style="max-width: 55px"
          @focus="focusOn('first')"
          @input="validate()"
        />
        rows ↑ ... ↓ Last
        <v-text-field
          v-model="last"
          class="mx-4"
          type="number"
          ref="refLastRows"
          :rules="lastRowsRules"
          :disabled="isFetching"
          style="max-width: 55px"
          @focus="focusOn('last')"
          @input="validate()"
        />
        rows ↓
        <v-btn
          type="submit"
          color="primary"
          text
          class="ml-5"
          :disabled="isFetching || !valid"
          :loading="isFetching"
          @click.prevent="onLoad"
        >
          Load
        </v-btn>
      </v-form>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'WorkSheetPaginator',
  props: ['isFetching', 'rowsCount', 'firstRows', 'lastRows'],
  data: () => ({
    valid: false,
    first: 10,
    last: 10,
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
  created () {
    this.first = this.firstRows;
    this.last = this.lastRows
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
    onLoad () {
      this.$emit('onLoad', {
        firstRows: this.first,
        lastRows: this.last
      })
    },
    onMouseenter () {
      this.$emit('mouseenter')
    }
  },
  watch: {
    firstRows (newValue) {
      this.first = newValue
    },
    lastRows (newValue) {
      this.last = newValue
    }
  }
}
</script>

<style lang="scss">
  .expand-tr {
    position: relative;
    cursor: default;
    height: 60px;
  }
  .expand-table-td {
    position: absolute;
    width: 100%;
    height: 60px !important;
    left: 0;
    background: #fff;
    border: none !important;
    -webkit-box-shadow: 0 0 80px 0 #a2a2a2;
    -moz-box-shadow: 0 0 80px 0 #a2a2a2;
    box-shadow: 0 0 80px 0 #a2a2a2;
    padding: 0 !important;
    form {
      display: flex;
      align-items: center;
      justify-content: center;
      height: inherit;
    }
    .v-messages.error--text {
      position: absolute;
      bottom: 2px;
    }
  }
</style>