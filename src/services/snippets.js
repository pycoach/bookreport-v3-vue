import Vue from 'vue'
import api from 'Api'

const URL = '/snippet/';
const state = {
  snippets: [],
  isLoadingSnippets: false
};

const getters = {
  getSnippets: state => {
    return state.snippets
  },
};

const actions = {
  async loadSnippets(context, documentId) {
    context.commit('SET_LOADING', true);
    let response;
    try {
      response = await api().get(URL + 'document/' + documentId);
    } catch (e) {
      return
    }
    context.commit('SET_LOADING', false);
    context.commit('SET_SNIPPETS', response['data']);
    return response['data']
  },
  async addNewSnippet(context, payload) {
    let response;
    try {
      response = await api().post(URL, {
        document_id: payload.DocumentID,
        entity_id: payload.entity_id,
        page_index: parseInt(payload.page_index),
        x: payload.x,
        y: payload.y,
        width: payload.width,
        height: payload.height
      });
    } catch (e) {
      return
    }
    context.commit('SET_SUCCESS_MESSAGE', 'New Snippet is saved');
    return response['data']
  },
  async updateSnippet(context, payload) {
    let response;
    try {
      response = await api().put(URL, {
        document_id: payload.DocumentID,
        entity_id: payload.entity_id,
        page_index: parseInt(payload.page_index),
        x: payload.x,
        y: payload.y,
        width: payload.width,
        height: payload.height
      });
    } catch (e) {
      return
    }
    context.commit('SET_SUCCESS_MESSAGE', 'Snippet is updated');
    return response['data']
  },
  async deleteSnippet(context, entity_id) {
    let response;
    try {
      response = await api().delete(URL + entity_id);
    } catch (e) {
      return
    }
    context.commit('SET_SUCCESS_MESSAGE', 'Snippet is deleted');
    return response['data']
  }
};

const mutations = {
  SET_SNIPPETS(state, snippets) {
    state.snippets = snippets;
  },
  SET_LOADING(state, isLoading) {
    state.isLoadingSnippets = isLoading;
  },
  SET_SUCCESS_MESSAGE(state, message) {
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: message
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  name: 'DocumentSnippets'
}
