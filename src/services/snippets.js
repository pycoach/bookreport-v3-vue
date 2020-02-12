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
    console.log('loadSnippets VUEX --- ', response['data']);
    return response['data']
  },
  async addNewSnippet(context, payload) {
    let response;
    try {
      response = await api().post(URL, {
        document_id: payload.DocumentID,
        page_index: parseInt(payload.page_index),
        x: payload.X,
        y: payload.Y,
        width: payload.Width,
        height: payload.Height
      });
    } catch (e) {
      return
    }
    return response['data']
  },
  async updateSnippet(context, payload) {
    console.log('updateSnippet payload VUEX ---- ', payload);
    let response;
    try {
      response = await api().put(URL, {
        document_id: payload.DocumentID,
        page_index: parseInt(payload.page_index),
        x: payload.X,
        y: payload.Y,
        width: payload.Width,
        height: payload.Height
      });
    } catch (e) {
      return
    }
    return response['data']
  },
  async deleteSnippet(context, entity_id) {
    console.log('deleteSnippet payload VUEX ---- ', entity_id);
    let response;
    try {
      response = await api().delete(URL + entity_id);
    } catch (e) {
      return
    }
    return response['data']
  }
};

const mutations = {
  SET_SNIPPETS(state, snippets) {
    state.snippets = snippets;
  },
  SET_LOADING(state, isLoading) {
    state.isLoadingSnippets = isLoading;
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
