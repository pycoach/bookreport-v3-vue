import api from 'Api'

const DOC_EVENT_URL = '/document-event';
const PAGE_STATUS_URL = '/page-status';
const PAGE_MAP_END_POINT = (documentId, size, filename) => {
  return `/image/${documentId}/${size}/${filename}`
};

const state = {
  pageMap: {},
  image: null,
  pageStatuses: {},
  isLoadingPageStatus: false,
  isLoadingPreview: false,
  isLoadingDocumentEvent: false
};

const getters = {
};

const actions = {
  async loadPageMap(context, payload) {
    context.commit('setLoadingPreview', true);
    let response;  
    try {
      response = await api().get(PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName))
    } catch (e) {
      // Handle error
      return
    }
    context.commit('setLoadingPreview', false);
    context.commit('setPageMap', response['data']);
    return response['data']
  },
  async loadImage(context, payload) {
    context.commit('setLoadingPreview', true);
    let response;
    try {
      response = await api().get(PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName))
    } catch (e) {
      // Handle error
      return
    }
    context.commit('setLoadingPreview', false);
    context.commit('setImage', response['data']['image']);
    return response['data']
  },
  async loadPageStatus(context, payload) {
    context.commit('setLoadingDocumentEvent', true);
    let response;
    try {
      response = await api().get(`${PAGE_STATUS_URL}/${payload}`)
    } catch (e) {
      // Handle error
      return
    }
    context.commit('setLoadingDocumentEvent', false);
    context.commit('setPageStatus', response['data']);
    return response['data']
  }, 
  async loadDocumentEvent(context, payload) {
    let response;
    try {
      response = await api().post(`${DOC_EVENT_URL}`, {
        document_id: payload.file_id, 
        page_index: payload.page_index, 
        event_type: payload.event_type
      })
    } catch (e) {
      // Handle error
      return
    }
    context.commit('setLoadingDocumentEvent', false);
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
  setPageStatus(state, statuses) {
    state.pageStatuses = statuses
  },
  setLoadingPageStatus(state, isLoading) {
    state.isLoadingPageStatus = isLoading
  },
  setLoadingPreview(state, isLoading) {
    state.isLoadingPreview = isLoading
  },
  setLoadingDocumentEvent(state, isLoading) {
    state.isLoadingDocumentEvent = isLoading
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
