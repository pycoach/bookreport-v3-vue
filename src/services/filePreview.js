import Vue from 'vue'
import api from 'Api'

const PAGE_MAP_END_POINT = (documentId, size, filename) => {
  return `/image/${documentId}/${size}/${filename}`
};

const state = {
  pageMap: {},
  isLoading: false
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
  const pageMap = response['data'];
  if (pageMap['error']) {
    alert()
  } else {
    context.commit('setPageMap', pageMap);
  }
  return pageMap
}

function handlePageMap2(context, response) {
  const image = response['data'];
  console.log('image response', image)
  return image
}

const actions = {
  loadPageMap(context, payload) {
    get(context, PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName), handlePageMap)
  }
};

const mutations = {
  setPageMap(state, pageMap) {
    state.pageMap = pageMap
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading
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
