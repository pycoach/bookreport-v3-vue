<template>
  <div class="v-data-table disable-hover theme--light">
<!--    <div v-for="n in allSnippets">-->
<!--      <div>{{n}}</div>-->
<!--    </div>-->
    <WorkSheetSnippetsList 
      :snippets="sheetSnippets"
      @handleDelete="handleSnippetDelete($event)"
      @mouseenter="highlightCells($event.from, $event.to)"
      @mouseleave="removeHighlights('remove')"
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
              <template v-if="filledCells[headings[xAxis] + Number(yAxis + 1)] && !isComputingSnippets">
                {{filledCells[headings[xAxis] + Number(yAxis + 1)][2]}}
              </template>
              <template v-else-if="isComputingSnippets">
                <v-skeleton-loader
                  loading
                  type="chip"
                  class="mx-0"
                />
              </template>
            </td>
          </tr>
        </template>
        <!-- Showing first and last Rows -->
        <template v-else-if="!showAllRows">
          <!-- First Rows -->
          <tr v-for="(row, yAxis) in Number(firstRows)" :key="yAxis + 1">
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
              <template v-if="filledCells[headings[xAxis] + Number(yAxis + 1)] && !isComputingSnippets">
                {{filledCells[headings[xAxis] + Number(yAxis + 1)][2]}}
              </template>
              <template v-else-if="isComputingSnippets">
                <v-skeleton-loader
                  loading
                  type="chip"
                  class="mx-0"
                />
              </template>
            </td>
          </tr>
          <!-- Paginator -->
          <WorkSheetPaginator
            :rowsCount="rows"
            :isFetching="isFetching"
            @mouseenter="onWorkSheetLeave()"
            @onLoad="requestSheetDataDetailed($event)"
          />
          <!-- Last Rows -->
          <tr v-for="(row, yAxis) in Number(lastRows)" :key="'last' + (rows - lastRows + yAxis)">
            <td class="disabled-td">
              {{ rows - lastRows + yAxis + 1 }}
            </td>
            <td
              v-for="(column, xAxis) in columns" :id="activeTab + 'cell_' + String(xAxis) + '-' + String(rows - lastRows + yAxis)"
              @click="onCellClick(String(xAxis) + '-' + String(rows - lastRows + yAxis))"
              @mouseenter="onCellEnter(String(xAxis) + '-' + String(rows - lastRows + yAxis))"
            >
              <!-- Getting actual coordinates-->
              <!-- xAxis - headings[xAxis]-->
              <!-- yAxis - rows - lastRows + yAxis + 1-->
              <template v-if="filledCells[headings[xAxis] + Number(rows - lastRows + yAxis + 1)] && !isComputingSnippets">
                {{filledCells[headings[xAxis] + Number(rows - lastRows + yAxis + 1)][2]}}
              </template>
              <template v-else-if="isComputingSnippets">
                <v-skeleton-loader
                  loading
                  type="chip"
                  class="mx-0"
                />
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
import WorkSheetPaginator from './WorkSheetPaginator';
import WorkSheetSnippetsList from '../components/WorkSheetSnippetsList'
export default {
  name: 'WorkSheet',
  components: {
    WorkSheetPaginator,
    WorkSheetSnippetsList
  },
  props: ['sheetName', 'projectId', 'fileId', 'columns', 'rows', 'activeTab'],
  data: () => ({
    headings: [],
    selectedCell: null,
    selectedCells: {},
    filledCells: {},
    showAllRows: false,
    sheetSnippets: [],
    firstRows: 10,
    lastRows: 10,
    isFetching: false,
    isComputingSnippets: false
  }),
  computed: {
    ...mapState('ExcelServices', ['sheetData', 'isLoadingSheetData', 'allSnippets', 'showSnippetsList'])
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
    this.requestSnippets()
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
      return this.$store.dispatch('ExcelServices/loadSheetData', payload)
    },
    requestSheetDataDetailed (e) {
      this.isFetching = true;
      const payload = {
        file_id: this.fileId,
        sheet: this.activeTab,
        first_rows: e.firstRows,
        last_rows: e.lastRows
      };
      this.$store.dispatch('ExcelServices/loadSheetDataDetailed', payload).then(() => {
        this.firstRows = e.firstRows;
        this.lastRows = e.lastRows;
        this.scrappingCells();
        setTimeout(() => {
          this.renderSnippets();
        });
        this.isFetching = false
      }).finally(() => {
        this.isFetching = false
      })
    },
    setSnippets () {
      const payload = {
        document_id: this.fileId,
        project_id: this.projectId,
        sheet: this.activeTab,
        sheetName: this.sheetName,
        ...this.selectedCells
      };
      this.$store.dispatch('ExcelServices/addSnippet', payload).then((res) => {
        this.allSnippets.push(res);
        this.renderSnippets()
      })
    },
    requestSnippets () {
      if (this.allSnippets.length) {
        this.renderSnippets();
        return
      }
      this.isComputingSnippets = true;
      this.$store.dispatch('ExcelServices/loadSnippets', { file_id: this.fileId }).then(() => {
        this.renderSnippets()
      }).finally(() => {
        this.isComputingSnippets = false
      })
    },
    coordinateToNumber (coordinate) {
      return this.headings.indexOf(coordinate.match(/[a-zA-Z]+/g)[0]) + '-' + (Number(coordinate.match(/\d+/g)[0]) - 1)
    },
    renderSnippets () {
      this.sheetSnippets = this.allSnippets.filter((snippets) => Number(snippets.sheet) === Number(this.activeTab))
      for (let i = 0; i < this.sheetSnippets.length; i++) {
        this.selectCells(this.coordinateToNumber(this.sheetSnippets[i].cell1), this.coordinateToNumber(this.sheetSnippets[i].cell2));
        this.highlightSnippets();
      }
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
    },
    handleSnippetDelete (entityId) {
      const index = this.allSnippets.findIndex(snippet => snippet.entity_id === entityId);
      this.allSnippets.splice(index, 1);
      this.removeHighlights('highlight');
      this.renderSnippets()
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