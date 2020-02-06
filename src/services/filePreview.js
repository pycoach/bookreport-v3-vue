import api from 'Api'

const DOC_EVENT_URL = '/document-event';
const PAGE_MAP_END_POINT = (documentId, size, filename) => {
  return `/image/${documentId}/${size}/${filename}`
};

const state = {
  pageMap: {},
  image: null,
  isLoading: false
};

const getters = {
};

const actions = {
  async loadPageMap(context, payload) {
    context.commit('setLoading', true);
    let response;  
    try {
      response = await api().get(PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName))
    } catch (e) {
      // Handle error
      return
    }
    context.commit('setLoading', false);
    context.commit('setPageMap', response['data']);
    return response['data']
  },
  async loadImage(context, payload) {
    context.commit('setLoading', true);
    let response;
    try {
      response = await api().get(PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName))
    } catch (e) {
      // Handle error
      return
    }
    context.commit('setLoading', false);
    context.commit('setImage', response['data']['image']);
    return response['data']
  },
  async loadDocumentEvent(context, payload) {
    context.commit('setLoading', true);
    let response;
    try {
      response = await api().get(`${DOC_EVENT_URL}/${payload}`)
    } catch (e) {
      // Handle error
      return
    }
    console.log('loadDocumentEvent', response['data']);
    context.commit('setLoading', false);
    return response['data']
  }
};

const mutations = {
  setPageMap(state, pageMap) {
    state.pageMap = pageMap
  },
  setImage(state, image) {
    state.image = image
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  name: 'FilePreview'
}
