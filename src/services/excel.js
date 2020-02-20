import Vue from 'vue'
import api from 'Api'

const URL = '/excel/';
const state = {
  workbookSummary: {},
  sheetData: {},
  isLoading: false,
  isLoadingSheetData: false,
};

const getters = {

};

const actions = {
  async loadWorkbookSummary(context, file_id) {
    context.commit('SET_LOADING', true);
    let response;
    try {
      response = await api().get(URL + file_id);
    } catch (e) {
      context.commit('SET_MESSAGE', e, 'error');
      return
    }
    context.commit('SET_LOADING', false);
    context.commit('SET_WORKBOOK_SUMMARY', response['data']);
    return response['data']
  },
  async loadSheetData(context, payload) {
    context.commit('SET_LOADING_SHEETS', true);
    let response;
    try {
      response = await api().get(`${URL}${payload.file_id}/sheet/${payload.sheet}`);
    } catch (e) {
      context.commit('SET_MESSAGE', e, 'error');
      return
    }
    context.commit('SET_LOADING_SHEETS', false);
    context.commit('SET_SHEET_DATA', response['data']);
    return response['data']
  },
};

const mutations = {
  SET_WORKBOOK_SUMMARY(state, data) {
    state.workbookSummary = data;
  },
  SET_SHEET_DATA(state, data) {
    state.sheetData = data;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_LOADING_SHEETS (state, isLoading) {
    state.isLoadingSheetData = isLoading;
  },
  SET_MESSAGE(state, message, type) {
    Vue.notify({
      group: 'loggedIn',
      type: type,
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
  name: 'ExcelServices'
}
