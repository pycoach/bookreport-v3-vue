<template>
  <div>
    <v-card>
      <v-toolbar dark color="primary" class="no-radius">
        <v-toolbar-title>View - {{file_name}}</v-toolbar-title>
      </v-toolbar>
    </v-card>
    <v-container fluid>
      <v-tabs
        v-model="tabs"
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
            :columns=sheet.columns
            :rows=sheet.rows
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
import WorkSheet from '../components/categoriesComponents/Document/Excel/WorkSheet'
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
  }),
  async mounted () {
    await this.requestWorkbookSummary()
  },
  methods: {
    requestWorkbookSummary () {
      this.$store.dispatch('ExcelServices/loadWorkbookSummary', this.entity_id)
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