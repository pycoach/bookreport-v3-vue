import Vue from 'vue'
import api from 'Api'

const URL = '/search';
const state = {
  searchType: 'basic',
  documents: []
};

const getters = {
  searchType: state => {
    return state.searchType
  }
};

function post(context, URL, data, handler) {
  return api().post(URL, data).then(response => handler(context, response))
}

function handleDocumentLoad(context, response) {
  const documents = response['data'];
  console.log('[Vuex] documents', documents);
  if (documents['error']) {
    context.commit('apiError', documents['error'])
  } else {
    context.commit('documentsLoaded', documents)
  }
}

const actions = {
  loadDocuments(context, payload) {
    post(context, URL, payload, handleDocumentLoad)
  }
};

const mutations = {
  documentsLoaded(state, documents) {
    state.documents = documents;
  },
  changeSearchType(state, type) {
    state.searchType = type
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'ProjectDocuments'
}
