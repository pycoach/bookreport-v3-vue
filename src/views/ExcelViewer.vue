<template>
  <div>
    <v-card>
      <v-toolbar dark color="primary" class="no-radius">
        <v-toolbar-title>View - {{file_name}}</v-toolbar-title>
        <v-scroll-y-transition>
          <span class="ml-5" v-if="currentEnteredCell">
            Snippet = 
            <strong v-if="isSelecting">
              {{currentEnteredCell.coordinates[0] + currentEnteredCell.coordinates[1] + ': '}}
            </strong>
            {{currentEnteredCell.formula}}
          </span>
        </v-scroll-y-transition>
        <v-spacer />
        <v-scroll-x-transition>
          <v-btn
            v-if="isSelecting"
            text
            key="delete"
            @click="resetSelection"
          >
            Cancel Snippet (ESC)
          </v-btn>
        </v-scroll-x-transition>
      </v-toolbar>
    </v-card>
    <v-container fluid>
      <v-tabs
        v-model="tabs"
        :key="tabs"
        fixed-tabs
        centered
        background-color="rgba(69, 90, 247, 0.08)"
        show-arrows
        class="rounded-tabs"
      >
        <v-tabs-slider />
        <v-tab v-for="(sheet, n) in workbookSummary.sheets" :key="n" class="primary--text">
          <span>Rows: {{sheet.rows}}</span>
          <span>Columns: {{sheet.columns}}</span>
          <span><strong>{{sheet.title}}</strong></span>
        </v-tab>
        <v-tab-item v-for="(sheet, n) in workbookSummary.sheets" :key="n" class="tabItem">
          <WorkSheet
            ref="workSheet"
            :columns=sheet.columns
            :rows=sheet.rows
            :activeTab="tabs"
            @onSelect="handleCellSelect"
            @onCellEnter="handleCellEnter"
          />
          {{n}}
          {{sheet.columns}}
          {{sheet.rows}}
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import {mapState} from "vuex";
import WorkSheet from '../components/WorkSheet'
export default {
  name: 'ExcelViewer',
  props: ['entity_id', 'file_name'],
  components: {
    WorkSheet
  },
  computed: {
    ...mapState('ExcelServices', ['workbookSummary'])
  },
  data: () => ({
    tabs: null,
    isSelecting: false,
    currentEnteredCell: null,
    timer: null
  }),
  async mounted () {
    await this.requestWorkbookSummary()
  },
  methods: {
    requestWorkbookSummary () {
      this.$store.dispatch('ExcelServices/loadWorkbookSummary', this.entity_id)
    },
    handleCellSelect (id) {
      id ? this.isSelecting = true : this.isSelecting = false;
    },
    handleCellEnter (data) {
      this.currentEnteredCell = null;
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.currentEnteredCell = data
        clearTimeout(this.timer)
      }, 100)
    },
    resetSelection () {
      this.$refs.workSheet[0].resetSelection()
    }
  }
}
</script>

<style class="scss">
  .pt-0 .v-content__wrap {
    padding-top: 0;
  }
  .rounded-tabs .v-tabs-bar{
    border-top-left-radius: 5px;  
    border-top-right-radius: 5px;  
  }
</style>