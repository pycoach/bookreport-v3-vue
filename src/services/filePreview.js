import Vue from 'vue'
import api from 'Api'

const PAGE_MAP_END_POINT = (documentId, size, filename) => {
  return `/image?document_id=${documentId}&size=${size}&filename=${filename}`
};

const state = {
  file: {},
  fileIsLoading: false
};

const getters = {
};

function get(context, URL, handler) {
  api().get(URL).then(response => handler(context, response))
}

function post(context, URL, data, handler) {
  return api().post(URL, data).then(response => handler(context, response))
}

function handlePageMap(context, response) {
  context.commit('setLoading', false);
  const file = response['data'];
  if (file['error']) {
    alert()
  } else {
    context.commit('setPageMap', file);
  }
  return file
}

const actions = {
  loadPageMap(context, payload) {
    get(context, PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName), handlePageMap)
  }
};

const mutations = {
  setPageMap(state, file) {
    state.file = file
  },
  setLoading(state, isLoading) {
    state.fileIsLoading = isLoading
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  name: 'FilePreview'
}
