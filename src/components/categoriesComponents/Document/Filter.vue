<template>
  <v-layout wrap>
    <v-row>
      <v-col md="12" xs="12">
        <v-card>
          <v-toolbar>
            <v-card-title class="headline">
              Filter
            </v-card-title>
          </v-toolbar>
          <v-expansion-panels>
            <v-expansion-panel class="exclude-shadow">
              <v-expansion-panel-header>No Filter applied</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container fluid class="pt-0">
                  <v-layout row justify-space-around>
                    <v-flex xs4 class="d-flex align-center justify-center px-4">
                      <v-btn 
                        color="primary"
                        text
                      >
                        <i class="material-icons">refresh</i>
                        Clear Filter
                      </v-btn>
                    </v-flex>
                    <v-flex xs4 class="px-4">
                      <v-select
                        item-text="desc"
                        item-value="uploadSet"
                        ref="uploadSetSelect"
                        label="All upload sets"
                        single-line
                        class="wideSelect"
                      />
                    </v-flex>
                    <v-flex xs4 class="px-4">
                      <v-select
                        label="Both duplicate and not"
                        single-line
                        class="wideSelect"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout row justify-space-around>
                    <v-flex xs4 class="px-4">
                      <v-select
                        item-text="desc"
                        item-value="trade"
                        label="All trades"
                        single-line
                      />
                    </v-flex>
                    <v-flex xs4 class="px-4">
                      <v-select
                        item-text="desc"
                        item-value="transaction"
                        label="All transactions"
                        single-line
                      />
                    </v-flex>
                    <v-flex xs4 class="px-4">
                      <v-select
                        item-text="desc"
                        item-value="documentType"
                        label="All document types"
                        single-line
                        class="wideSelect"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout row justify-space-around>
                    <v-flex xs4 class="px-4">
                      <v-select
                        item-text="desc"
                        item-value="sizeGroup"
                        label="All file sizes"
                        single-line
                      />
                    </v-flex>
                    <v-flex xs4 class="px-4">
                      <v-select
                        item-text="desc"
                        item-value="type"
                        label="All file types"
                        single-line
                      />
                    </v-flex>
                    <v-flex xs4 class="px-4">
                      <v-select
                        label="Both supported and not"
                        single-line
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  name: 'FiltersList'
}
</script>

<style scoped>
  .exclude-shadow:before {
    box-shadow: none !important;
  }
</style>