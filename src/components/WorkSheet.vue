<template>
  <div class="v-data-table disable-hover theme--light">
    <div class="v-data-table__wrapper">
      <table>
        <thead>
          <td class="disabled-td" />
          <th v-for="heading in headings">
            {{ heading }}
          </th>
        </thead>
        <tbody>
        <tr v-for="(_, rowIndex) in rows">
          <td class="disabled-td">
            {{ rowIndex + 1 }}
          </td>
          <td 
            v-for="(_, index) in columns" :id="activeTab + 'cell_' + String(index) + '-' + String(rowIndex)"
            @click="onCellClick(String(index) + '-' + String(rowIndex))"
            @mouseenter="onCellEnter(String(index) + '-' + String(rowIndex))"
          >
            Test {{Math.floor(Math.random(0, 99999) * 1000)}}
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
  props: ['columns', 'rows', 'activeTab'],
  data: () => ({
    headings: [],
    selectedCell: null
  }),
  created () {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  mounted () {
    this.initHeadings()
  },
  methods: {
    initHeadings () {
      for (let i = 0; i < this.columns; i++) {
        this.headings.push(String.fromCharCode(97 + i).toUpperCase())
      }
    },
    selectCells (from, to) {
      const cordsX = [Number(from.split('-')[0]), Number(to.split('-')[0])];
      const cordsY = [Number(from.split('-')[1]), Number(to.split('-')[1])];
      let activeCoordinates = [];
      for (let i = Math.min(...cordsX); i <= Math.max(...cordsX); i++) {
        for (let j = Math.min(...cordsY); j <= Math.max(...cordsY); j++) {
          activeCoordinates.push(i + '-' + j)
        }
      }
      this.removeTemporaryHighlights()
      // Adding temporary highlight classes to cells
      for (let i = 0; i < activeCoordinates.length; i++) {
        document.getElementById(this.activeTab + 'cell_' + activeCoordinates[i]).classList.add('highlight-temp')
      }
    },
    resetSelection () {
      this.$emit('onSelect', false)
      this.removeTemporaryHighlights()
      this.selectedCell = null
    },
    removeTemporaryHighlights () {
      let temporaryCells = document.querySelectorAll('.highlight-temp')
      for (let i = 0; i < temporaryCells.length; i++) {
        temporaryCells[i].classList.remove('highlight-temp')
      }
    },
    onCellClick (id) {
      if (this.selectedCell) {
        let temporaryCells = document.querySelectorAll('.highlight-temp')
        for (let i = 0; i < temporaryCells.length; i++) {
          temporaryCells[i].classList.add('highlight')
        }
        this.resetSelection();
      } else {
        this.selectedCell = id
        this.$emit('onSelect', true)
      }
    },
    onCellEnter(id) {
      // Getting mouse entered cell
      const formula = document.getElementById(this.activeTab + 'cell_' + id).innerText;
      const coordinates = [this.headings[id.split('-')[0]], id.split('-')[1]];
      this.$emit('onCellEnter', { formula, coordinates });
      
      // Selecting cells
      if (this.selectedCell) {
        this.selectCells(this.selectedCell, id)
      }
    },
    handleKeyDown (event) {
      if (event.keyCode !== 27 || !this.selectedCell) return;
      this.resetSelection()
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }
}
</script>

<style lang="scss" scoped>
  .v-data-table__wrapper {
    td {
      border-left: 1px solid #F1F4F8;
      transition: 0.3s;
      &.disabled-td {
        width: 54px;
        font-weight: 600;
        font-size: 14px;
        color: #C8CBCE !important;
        text-align: center;
        cursor: default;
      }
      &.highlight-temp {
        background: rgba(69, 90, 247, 0.1);
      }
      &.highlight {
        background: rgba(69, 90, 247, 0.2);
      }
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