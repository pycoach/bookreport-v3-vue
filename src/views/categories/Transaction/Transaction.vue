<template>
  <div>
    <h2>Transaction</h2>
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
  name: 'Transaction',
  mounted() {
    const req = require.context('../../../components/categoriesComponents/Transaction', true, /\.(vue)$/i)
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
      components: Components
    }
  }
}
</script>