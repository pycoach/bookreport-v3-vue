<template>
  <div class="v-data-table disable-hover theme--light">
    <div class="v-data-table__wrapper">
      <v-overlay
        :value="isLoadingSheetData"
        absolute
        opacity="1"
        color="#fff"
      >
        <v-progress-circular color="primary" indeterminate size="64" />
      </v-overlay>
      <table v-show="!isLoadingSheetData" @mouseleave="onWorkSheetLeave()">
        <thead>
          <td class="disabled-td" />
          <th v-for="heading in headings">
            {{ heading }}
          </th>
        </thead>
        <tbody>
        <!-- Showing all Rows -->
        <template v-if="showAllRows">
          <tr v-for="(row, yAxis) in rows">
            <td class="disabled-td">
              {{ yAxis + 1 }}
            </td>
            <td 
              v-for="(column, xAxis) in columns" :id="activeTab + 'cell_' + String(xAxis) + '-' + String(yAxis)"
              @click="onCellClick(String(xAxis) + '-' + String(yAxis))"
              @mouseenter="onCellEnter(String(xAxis) + '-' + String(yAxis))"
            >
              <!-- Getting actual coordinates-->
              <!-- xAxis - headings[xAxis]-->
              <!-- yAxis - Number(yAxis + 1)-->
              <template v-if="filledCells[headings[xAxis] + Number(yAxis + 1)]">
                {{filledCells[headings[xAxis] + Number(yAxis + 1)][2]}}
              </template>
            </td>
          </tr>
        </template>
        <!-- Showing first and last Rows -->
        <template v-else-if="!showAllRows">
          <tr v-for="(row, yAxis) in firstRows">
            <td class="disabled-td">
              {{ yAxis + 1 }}
            </td>
            <td
              v-for="(column, xAxis) in columns" :id="activeTab + 'cell_' + String(xAxis) + '-' + String(yAxis)"
              @click="onCellClick(String(xAxis) + '-' + String(yAxis))"
              @mouseenter="onCellEnter(String(xAxis) + '-' + String(yAxis))"
            >
              <!-- Getting actual coordinates-->
              <!-- xAxis - headings[xAxis]-->
              <!-- yAxis - Number(yAxis + 1)-->
              <template v-if="filledCells[headings[xAxis] + Number(yAxis + 1)]">
                {{filledCells[headings[xAxis] + Number(yAxis + 1)][2]}}
              </template>
            </td>
          </tr>
          <!-- Expand button row-->
          <tr @mouseenter="onWorkSheetLeave()" class="expand-tr">
            <td></td>
            <td class="expand-table-td">
              ↑ First {{firstRows}} rows ↑ ... ↓ Last {{lastRows}} rows ↓
            </td>
          </tr>
          <tr v-for="(row, yAxis) in lastRows + 1">
            <td class="disabled-td">
              {{ rows - lastRows + yAxis }}
            </td>
            <td
              v-for="(column, xAxis) in columns" :id="activeTab + 'cell_' + String(xAxis) + '-' + String(rows - lastRows + yAxis - 1)"
              @click="onCellClick(String(xAxis) + '-' + String(rows - lastRows + yAxis - 1))"
              @mouseenter="onCellEnter(String(xAxis) + '-' + String(rows - lastRows + yAxis - 1))"
            >
              <!-- Getting actual coordinates-->
              <!-- xAxis - headings[xAxis]-->
              <!-- yAxis - Number(rows - lastRows + yAxis)-->
              <template v-if="filledCells[headings[xAxis] + Number(rows - lastRows + yAxis)]">
                {{filledCells[headings[xAxis] + Number(rows - lastRows + yAxis)][2]}}
              </template>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: 'WorkSheet',
  props: ['file_id', 'columns', 'rows', 'activeTab'],
  data: () => ({
    headings: [],
    selectedCell: null,
    filledCells: {},
    showAllRows: false,
    firstRows: 10,
    lastRows: 10
  }),
  computed: {
    ...mapState('ExcelServices', ['sheetData', 'isLoadingSheetData'])
  },
  created () {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  async mounted () {
    if (this.rows <= 21) {
      this.showAllRows = true;
    }
    await this.requestSheetData();
    this.initHeadings();
    this.scrappingCells();
  },
  methods: {
    initHeadings () {
      for (let i = 0; i < this.columns; i++) {
        this.headings.push(String.fromCharCode(97 + i).toUpperCase())
      }
    },
    scrappingCells () {
      for (let i = 0; i < this.sheetData.length; i++) {
        this.filledCells[this.sheetData[i][0]] = this.sheetData[i]
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
    },
    onWorkSheetLeave () {
      this.$emit('onCellEnter', null);
    },
    requestSheetData () {
      const payload = {
        file_id: this.file_id,
        sheet: this.activeTab
      };
      return this.$store.dispatch('ExcelServices/loadSheetData', payload)
    },
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }
}
</script>

<style lang="scss" scoped>
  .v-data-table__wrapper {
    table {
      position: relative;
    }
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
  .expand-tr {
    height: 60px;
  }
  .expand-table-td {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: inherit;
    left: 0;
    background: #fff;
    border: none !important;
    -webkit-box-shadow: 0 0 80px 0 #a2a2a2;
    -moz-box-shadow:    0 0 80px 0 #a2a2a2;
    box-shadow:         0 0 80px 0 #a2a2a2;
  }
</style>