<template>
  <div>
    <div class="d-flex justify-space-between base-y-padding">
      <div class="d-flex align-center">
      <h2 class="top-header ">Projects</h2>
      <div class="vertical-divider"></div>
       <img class="mr-3" src="../../../assets/search.svg" alt="">
      <v-text-field
          class="top-search"
          label="Find Projects"
          placeholder="Find Projects"
          v-model="search"
          >
        </v-text-field>
        </div>
          <div class=" d-flex  mt-4">
               <v-btn  class="ml-5 btn-primary  top-large-button "
          @click="$router.push('/Projecteditor/new')">
            New Project
          </v-btn>
       </div> 
    </div>
    <div class="large-divider mt-5 base-y-margin" > </div>
    <v-row class="mb-6" no-gutters>
      <v-col v-for="component in components" :key="component.name">
        <component v-bind:is="component"></component>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
const Components = []

export default {
  name: 'Project',
  mounted() {
    const req = require.context('../../../components/categoriesComponents/Project', true, /\.(vue)$/i)
    let allComponentsFiles = req.keys().map(key => {
      const name = key.match(/\w+/)[0]
      return Vue.component(name, req(key))
    })
    for(let i = 0; i < allComponentsFiles.length; i++) {
      if (allComponentsFiles[i].default == Components[i]) {
        continue
      }
      Components.push(allComponentsFiles[i].default)
    }
  },
  data() {
    return {
      search: '',
      components: Components
    }
  }
}
</script>