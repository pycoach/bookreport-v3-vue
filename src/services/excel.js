import Vue from 'vue'
import api from 'Api'

const URL = '/excel/';
const URL_SNIPPET = '/excel-snippet/';
const state = {
  workbookSummary: {},
  sheetData: {},
  allSnippets: [],
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
  async loadSheetDataDetailed(context, payload) {
    let response;
    try {
      response = await api().get(`${URL}${payload.file_id}/sheet/${payload.sheet}/${payload.first_rows}/${payload.last_rows}`);
    } catch (e) {
      context.commit('SET_MESSAGE', { message: e, type: 'error' });
      return
    }
    context.commit('SET_SHEET_DATA', response['data']);
    return response['data']
  },
  async addSnippet(context, payload) {
    let response;
    try {
      response = await api().post(`${URL_SNIPPET}`, {
        document_id: payload.document_id,
        project_id: payload.document_id,
        sheet: String(payload.sheet),
        sheet_name: payload.sheetName,
        cell1: payload.from,
        cell2: payload.to,
        col_range: payload.colRange,
        row_range: payload.rowRange,
        values: payload.values
      });
    } catch (e) {
      context.commit('SET_MESSAGE', { message: e, type: 'error' });
      return
    }
    context.commit('SET_MESSAGE', { message: 'Snippets are added', type: 'success' });
    return response['data']
  },
  async loadSnippets(context, payload) {
    let response;
    try {
      response = await api().get(`${URL_SNIPPET}document/${payload.file_id}`);
    } catch (e) {
      context.commit('SET_MESSAGE', { message: e, type: 'error' });
      return
    }
    context.commit('SET_SHEET_SNIPPETS', response['data']);
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
  SET_SHEET_SNIPPETS(state, data) {
    state.allSnippets = data;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_LOADING_SHEETS (state, isLoading) {
    state.isLoadingSheetData = isLoading;
  },
  SET_MESSAGE(state, details) {
    Vue.notify({
      group: 'loggedIn',
      type: details.type,
      text: details.message
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
