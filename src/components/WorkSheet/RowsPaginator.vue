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
          :value="firstRows"
          class="mx-4"
          type="number"
          ref="refFirstRows"
          :rules="firstRowsRules"
          style="max-width: 50px"
          @input="validate"
        />
        rows ↑ ... ↓ Last
        <v-text-field
          :value="lastRows"
          class="mx-4"
          type="number"
          ref="refLastRows"
          :rules="lastRowsRules"
          style="max-width: 50px"
          @input="validate"
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
    valid: true
  }),
  computed: {
    firstRowsRules () {
      const rules = [];
      const availableCount =
        v => (Number(v) || '') < this.rowsCount - this.lastRows + 1 ||
          `${this.rowsCount - this.lastRows} Row(s) is available for first`;
      rules.push(availableCount);
      return rules
    },
    lastRowsRules () {
      const rules = [];
      const maxCount =
        v => (Number(v) || '') < this.rowsCount + 1 ||
          `Maximum rows available ${this.rowsCount}`;
      rules.push(maxCount);
      const availableCount =
        v => (Number(v) || '') < this.rowsCount - this.firstRows + 1 ||
          `${this.rowsCount - this.firstRows} Row(s) is available for last`;
      rules.push(availableCount);
      return rules
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
    onLoad () {
      this.$emit('onLoad', {
        firstRows: this.$refs.refFirstRows.internalValue,
        lastRows: this.$refs.refLastRows.internalValue
      })
    },
    onMouseenter () {
      this.$emit('mouseenter')
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