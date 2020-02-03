import Vue from 'vue'
import api from 'Api'

const URL = '/search';
const GET_END_POINT = (documentId) => {
  return `/image/${documentId}/preview/page_map.json`
};
const state = {
  searchType: 'basic'
};

const getters = {
};

function get(context, URL, handler) {
  api().get(URL).then(response => handler(context, response))
}

function post(context, URL, data, handler) {
  return api().post(URL, data).then(response => handler(context, response))
}

function handleDocumentLoad(context, response) {
  // context.commit('setLoading', false);
  const document = response['data'];
  console.log(document);
  // if (documents['error']) {
    // context.commit('apiError', documents['error'])
  // } else {
    // context.commit('setDocuments', documents.files);
  // }
}

const actions = {
  loadDocument(context, payload) {
    console.log('GET_END_POINT(id)', GET_END_POINT(payload.id));
    get(context, GET_END_POINT(payload.id), '', handleDocumentLoad)
  }
};

const mutations = {
  // setDocuments(state, documents) {
  //   state.documents = documents;
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  name: 'FilePreview'
}
