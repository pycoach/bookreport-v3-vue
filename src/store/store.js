import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'

const req = require.context('../services', true, /\.(js)$/i)
let allServices = req.keys().map(key => {
  const name = key.match(/\w+/)[0];
  return Vue.component(name, req(key))
})

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth
  }
})

for (let i = 0; i < allServices.length; i++) {
  store.registerModule(`${allServices[i].default.name}`, allServices[i].default)
}