<template>
  <div class="v-data-table disable-hover theme--light">
    <div class="v-data-table__wrapper">
      <table>
        <thead>
          <th v-for="heading in headings">
            {{ heading }}
          </th>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in rows">
          <td 
            v-for="(column, index) in columns" :id="String(index) + '-' + String(rowIndex)"
            @click="onCellClick(String(index) + '-' + String(rowIndex))"
            @mouseenter="onCellEnter(String(index) + '-' + String(rowIndex))"
          >
            asd
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkSheet',
  props: ['columns', 'rows'],
  data: () => ({
    headings: [],
    selectedCell: null,
  }),
  mounted () {
    this.initHeadings()
  },
  methods: {
    initHeadings () {
      for (let i = 0; i < this.columns; i++) {
        this.headings.push(String.fromCharCode(97 + i).toUpperCase())
      }
    },
    onCellClick (id) {
      if (this.selectedCell) {
        this.selectedCell = null
      } else {
        this.selectedCell = id
        console.log('Clicked on', id)
      }
    },
    onCellEnter(id) {
      if (this.selectedCell) {
        console.log('Entered on', id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-data-table__wrapper {
    td {
      border-left: 1px solid #F1F4F8;
    }
  }
  .disable-hover {
    tr {
      &:hover {
        background: rgb(0, 0, 0, 0) !important;
      }
    }
  }
</style>