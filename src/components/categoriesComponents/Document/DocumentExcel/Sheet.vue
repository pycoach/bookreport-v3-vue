<template>
  <div class="v-data-table disable-hover theme--light">
    <sheet-snippet-list 
      :snippets="sheetSnippets"
      :processing="isProcessingNewSnippet"
      @mouseenter="highlightCells($event.from, $event.to)"
      @mouseleave="removeHighlights('remove')"
      @handleDelete="handleSnippetDelete"
    />
    <sheet-row-range
      :rowMode="rowMode"
      :rowsCount="rows"
      :firstRows="firstRows"
      :lastRows="lastRows"
      @change="handleRowRangeChange"
    />
    <sheet-column-selector
      :headings="headings"
      @onChange="changeColumns"
    />
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
          <th v-for="(_, colIndex) in columnsComputed" v-show="!hiddenColumns.includes(headings[colIndex])">
            {{ headings[xAxisComputed + colIndex] }}
          </th>
        </thead>
        <tbody>
          <!-- Showing Rows -->
          <template>
            <tr v-for="(__, rowIndex) in Number(rowsComputed)" :key="createRowKey(rowIndex)">
              <td class="disabled-td">
                {{yAxisComputed + rowIndex + 1}}
              </td>
              <td
                v-for="(___, colIndex) in columnsComputed" :id="createCellId(colIndex, rowIndex)"
                v-show="!hiddenColumns.includes(headings[colIndex])"
                :key="`${rowIndex}-${xAxisComputed}-${colIndex}`"
                @click="onCellClick(createCellCoordinates(colIndex, rowIndex))"
                @mouseenter="onCellEnter(createCellCoordinates(colIndex, rowIndex))"
              >
                <template v-if="getFilledCell(colIndex, rowIndex) && !isComputingSnippets">
                  {{ getFilledCell(colIndex, rowIndex)[2] }}
                </template>
                <!-- Loader -->
                <template v-else-if="isComputingSnippets">
                  <v-skeleton-loader
                    loading
                    type="chip"
                    class="mx-0"
                  />
                </template>
              </td>
            </tr>
            <template v-if="!showAllRows">
              <!-- Paginator -->
              <sheet-paginator
                :rowsCount="rows"
                :isFetching="isFetching"
                :firstRows="firstRows"
                :lastRows="lastRows"
                @mouseenter="onWorkSheetLeave()"
                @onLoad="requestSheetDataDetailed"
              />
              <!-- Last Rows -->
              <tr v-for="(_, rowIndex) in Number(lastRows)" :key="createRowKeyLast(rowIndex)">
                <td class="disabled-td">
                  {{rows - lastRows - yAxisComputed + rowIndex + 1}}
                </td>
                <td
                  v-for="(column, colIndex) in columnsComputed"
                  v-show="!hiddenColumns.includes(headings[colIndex])"
                  :key="`${rowIndex}-${xAxisComputed}-${colIndex}`"
                  :id="createCellIdLast(colIndex, rowIndex)"
                  @click="onCellClick(createCellCoordinatesLast(colIndex, rowIndex))"
                  @mouseenter="onCellEnter(createCellCoordinatesLast(colIndex, rowIndex))"
                >
                  <template v-if="getFilledCellLast(colIndex, rowIndex) && !isComputingSnippets">
                    {{getFilledCellLast(colIndex, rowIndex)[2]}}
                  </template>
                  <template v-else-if="isComputingSnippets">
                    <!-- Loader -->
                    <v-skeleton-loader
                      loading
                      type="chip"
                      class="mx-0"
                    />
                  </template>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import SheetPaginator from './SheetPaginator';
import SheetRowRange from './SheetRowRange';
import SnippetList from './SnippetList'
export default {
  name: 'WorkSheet',
  components: {
    SheetPaginator,
    SheetRowRange,
    'sheet-snippet-list': SnippetList,
    'sheet-column-selector': () => import('./SheetColumnSelector')
  },
  props: ['sheetName', 'projectId', 'fileId', 'columns', 'rows', 'activeTab'],
  data: () => ({
    headings: [],
    selectedCell: null,
    selectedCells: {},
    filledCells: {},
    showAllRows: false,
    shownRows: [],
    shownColumns: [],
    hiddenColumns: [],
    rowMode: 1,
    sheetSnippets: [],
    firstRows: 10,
    lastRows: 10,
    isFetching: false,
    isProcessingNewSnippet: false,
    isComputingSnippets: false
  }),
  computed: {
    ...mapState('WorkSheet', ['sheetData', 'isLoadingSheetData', 'allSnippets', 'showSnippetsList']),
    columnsComputed () {
      return this.shownColumns.length ? Math.max(...this.shownColumns) - Math.min(...this.shownColumns) + 1 : this.columns
    },
    xAxisComputed () {
      return this.shownColumns.length ? Math.min(...this.shownColumns) : 0
    },
    rowsComputed () {
      if (!this.showAllRows) {
        return this.firstRows;
      } else if (this.shownRows.length) {
        return Math.max(...this.shownRows) - Math.min(...this.shownRows) + 1
      }
      return this.rows
    },
    yAxisComputed () {
      return this.shownRows.length ? Math.min(...this.shownRows) - 1 : 0
    }
  },
  created () {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  async mounted () {
    if (this.rows <= 100) {
      this.showAllRows = true;
    }
    await this.requestSheetData();
    this.initHeadings();
    this.scrappingCells();
    this.requestSnippets();
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
      this.removeHighlights()
      let filledCells = [];
      for (let i = 0; i < activeCoordinates.length; i++) {
        let cell = document.getElementById(this.activeTab + 'cell_' + activeCoordinates[i]);
        // Adding temporary highlight classes to cells
        if (cell) {
          cell.classList.add('highlight-temp');
        }
        // Getting filled cells from selected
        if (this.filledCells[this.headings[activeCoordinates[i].split('-')[0]] + (Number(activeCoordinates[i].split('-')[1]) + 1)]) {
          filledCells.push(this.headings[activeCoordinates[i].split('-')[0]] + (Number(activeCoordinates[i].split('-')[1]) + 1))
        }
      }
      let self = this;
      this.selectedCells = {
        from: this.headings[Math.min(...cordsX)] + (Number(Math.min(...cordsY)) + 1),
        to: this.headings[Math.max(...cordsX)] + (Number(Math.max(...cordsY)) + 1),
        colRange: [(Math.min(...cordsX)) + 1, Math.max(...cordsX) + 1],
        rowRange: [(Math.min(...cordsY)) + 1, Math.max(...cordsY) + 1],
        get values () {
          let values = [];
          for (let key of filledCells) {
            values.push(self.filledCells[key])
          }
          return values
        }
      };
    },
    resetSelection () {
      this.$emit('onSelect', false)
      this.removeHighlights()
      this.selectedCell = null
    },
    removeHighlights (type = 'temporary') {
      let className;
      switch(type) {
        case 'remove':
          className = 'highlight-remove';
          break;
        case 'temporary':
          className = 'highlight-temp';
          break;
        case 'highlight':
          className = 'highlight';
          break;
      }
      let temporaryCells = document.querySelectorAll(`.${className}`)
      if (!temporaryCells.length) return;
      for (let i = 0; i < temporaryCells.length; i++) {
        temporaryCells[i].classList.remove(className)
        temporaryCells[i].classList.remove('highlight-temp')
      }
    },
    onCellClick (id) {
      if (this.selectedCell) {
        this.highlightSnippets();
        this.setSnippets();
        this.resetSelection();
      } else {
        this.selectedCell = id;
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
        file_id: this.fileId,
        sheet: this.activeTab
      };
      return this.$store.dispatch('WorkSheet/loadSheetData', payload)
    },
    requestSheetDataDetailed (e) {
      const { firstRows, lastRows } = e;
      // If the selected rows count is equal to all rows count  
      if (Number(firstRows) + Number(lastRows) >= this.rows) {
        this.requestSheetDataAll();
        return 
      }
      this.isFetching = true;
      const payload = {
        file_id: this.fileId,
        sheet: this.activeTab,
        first_rows: firstRows,
        last_rows: lastRows
      };
      return this.$store.dispatch('WorkSheet/loadSheetDataDetailed', payload).then(() => {
        this.firstRows = firstRows;
        this.lastRows = lastRows;
        this.scrappingCells();
        this.renderSnippets();
        this.showAllRows = false;
      }).finally(() => {
        this.isFetching = false;
        this.shownRows = [];
        this.shownColumns = [];
      })
    },
    requestSheetDataAll () {
      this.isFetching = true;
      const filesCount = Math.ceil(this.rows / 1000);
      const payload = {
        filesCount: filesCount,
        file_id: this.fileId,
        sheet: this.activeTab,
      };
      return this.$store.dispatch('WorkSheet/loadSheetDataAll', payload).then(() => {
        this.scrappingCells();
        this.renderSnippets();
        this.showAllRows = true;
      }).finally(() => {
        this.isFetching = false;
        this.shownRows = [];
        this.shownColumns = [];
      })
    },
    setSnippets () {
      this.isProcessingNewSnippet = true;
      const payload = {
        document_id: this.fileId,
        project_id: this.projectId,
        sheet: this.activeTab,
        sheetName: this.sheetName,
        ...this.selectedCells
      };
      this.$store.dispatch('WorkSheet/addSnippet', payload).then((res) => {
        this.allSnippets.push(res);
        this.renderSnippets()
      }).finally(() => {
        this.isProcessingNewSnippet = false;
      })
    },
    requestSnippets () {
      if (this.allSnippets.length) {
        this.renderSnippets();
        return
      }
      this.isComputingSnippets = true;
      this.$store.dispatch('WorkSheet/loadSnippets', { file_id: this.fileId }).then(() => {
        this.renderSnippets()
      }).finally(() => {
        this.isComputingSnippets = false
      })
    },
    coordinateToNumber (coordinate) {
      return this.headings.indexOf(coordinate.match(/[a-zA-Z]+/g)[0]) + '-' + (Number(coordinate.match(/\d+/g)[0]) - 1)
    },
    renderSnippets () {
      setTimeout(() => {
        this.sheetSnippets = this.allSnippets.filter((snippets) => Number(snippets.sheet) === Number(this.activeTab))
        for (let i = 0; i < this.sheetSnippets.length; i++) {
          this.selectCells(this.coordinateToNumber(this.sheetSnippets[i].cell1), this.coordinateToNumber(this.sheetSnippets[i].cell2));
          this.highlightSnippets();
        }
      })
    },
    highlightSnippets (type = 'add') {
      let className;
      switch(type) {
        case 'remove':
          className = 'highlight-remove';
          break;
        case 'add':
          className = 'highlight';
          break;
      }
      let temporaryCells = document.querySelectorAll('.highlight-temp')
      for (let i = 0; i < temporaryCells.length; i++) {
        temporaryCells[i].classList.add(className)
      }
    },
    highlightCells (from, to) {
      from = this.coordinateToNumber(from);
      to = this.coordinateToNumber(to);
      this.selectCells(from, to);
      this.highlightSnippets('remove');
      this.resetSelection()
    },
    handleSnippetDelete (entityId) {
      const index = this.allSnippets.findIndex(snippet => snippet.entity_id === entityId);
      this.allSnippets.splice(index, 1);
      this.removeHighlights('highlight');
      this.renderSnippets()
    },
    handleRowRangeChange (e) {
      const { mode, firstRows, lastRows, range } = e;
      this.rowMode = mode;
      switch(mode) {
        case 1: // First and Last rows
          this.requestSheetDataDetailed({ firstRows, lastRows })
          break;
        case 2: // All rows
          this.requestSheetDataAll();
          break;
        case 3:
          this.requestSheetDataAll().then(() => {
            const [from, to] = [range.split(':')[0], range.split(':')[1]];
            const [startRow, endRow] = [Number(this.coordinateToNumber(from).split('-')[1]) + 1, Number(this.coordinateToNumber(to).split('-')[1]) + 1];
            const [startColumn, endColumn] = [Number(this.coordinateToNumber(from).split('-')[0]), Number(this.coordinateToNumber(to).split('-')[0])];
            this.shownRows = [startRow, endRow];
            this.shownColumns = [startColumn, endColumn];
          });
          break;
      }
    },
    changeColumns (e) {
      this.hiddenColumns = e
    },
    createRowKey (rowIndex) {
      return `${this.yAxisComputed}-${rowIndex}`
    },
    createRowKeyLast (rowIndex) {
      return this.rows - this.lastRows - this.yAxisComputed + rowIndex + 1
    },
    createCellId (colIndex, rowIndex) {
      return this.activeTab + 'cell_' + String(this.xAxisComputed + colIndex) + '-' + String(this.yAxisComputed + rowIndex)
    },
    createCellIdLast (colIndex, rowIndex) {
      return this.activeTab + 'cell_' + String(this.xAxisComputed + colIndex) + '-' + String(this.rows - this.lastRows - this.yAxisComputed + rowIndex)
    },
    createCellCoordinates (colIndex, rowIndex) {
      return String(this.xAxisComputed + colIndex) + '-' + String(this.yAxisComputed + rowIndex)
    },
    createCellCoordinatesLast (colIndex, rowIndex) {
      return String(this.xAxisComputed + colIndex) + '-' + String(this.rows - this.lastRows - this.yAxisComputed + rowIndex)
    },
    getFilledCell (colIndex, rowIndex) {
      return this.filledCells[this.headings[this.xAxisComputed + colIndex] + Number(this.yAxisComputed + rowIndex + 1)]
    },
    getFilledCellLast (colIndex, rowIndex) {
      return this.filledCells[this.headings[this.xAxisComputed + colIndex] + Number(this.rows - this.lastRows - this.yAxisComputed + rowIndex + 1)]
    }
  },
  watch: {
    showAllRows (showAllRows) {
      if (showAllRows) {
        this.rowMode = 2 // All rows
      } else {
        this.rowMode = 1 // First and Last rows
      }
    }
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
      &.highlight-remove {
        background: rgba(255, 43, 43, 0.3);
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