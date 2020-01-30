import Vue from 'vue'

const state = {
  editMode: 'Create',
  name: '',
  user_id: null,
  users: [],
  user_ids: [],
  description: '',
  clients: []
};

const getters = {

};

const actions = {

};

const mutations = {
  setEditMode (state, editMode) {
    state.editMode = editMode
  },
  setName (state, name) {
    state.name = name
  },
  setUserId (state, user_id) {
    state.user_id = user_id
  },
  setUsers (state, users) {
    state.users = users
  },
  setUserIds (state, user_ids) {
    state.user_ids = user_ids
  },
  setDescription (state, description) {
    state.description = description
  },
  setClients (state, clients) {
    state.clients = clients
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  name: 'ProjectEditor'
}
