import api from 'Api'

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

function get(context, URL, handler) {
  api().get(URL).then(response => handler(context, response))
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

function handleImage(context, response) {
  context.commit('setLoading', false);
  const image = response['data'].image || '';
  if (image['error']) {
    alert()
  } else {
    context.commit('setImage', image);
  }
  return image
}

const actions = {
  loadPageMap(context, payload) {
    get(context, PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName), handlePageMap)
  },
  loadImage(context, payload) {
    get(context, PAGE_MAP_END_POINT(payload.id, payload.size, payload.fileName), handleImage)
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
