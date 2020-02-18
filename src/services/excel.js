import Vue from 'vue'
import api from 'Api'

const URL = '/excel/';
const state = {
  workbookSummary: {
  "sheets":
  [{"title": "TB", "cell_count": 200, "rows": 22, "columns": 14, "formula_count": 62}, {
    "title": "BS",
    "cell_count": 76,
    "rows": 31,
    "columns": 11,
    "formula_count": 33
  }, {"title": "IS", "cell_count": 56, "rows": 20, "columns": 8, "formula_count": 19}, {
    "title": "YTD SOI",
    "cell_count": 350,
    "rows": 21,
    "columns": 27,
    "formula_count": 97
  }, {"title": "LTD SOI", "cell_count": 1994, "rows": 81, "columns": 27, "formula_count": 94}, {
    "title": "GJ",
    "cell_count": 643,
    "rows": 97,
    "columns": 11,
    "formula_count": 0
  }, {"title": "GL", "cell_count": 596, "rows": 108, "columns": 11, "formula_count": 0}, {
    "title": "PCAP",
    "cell_count": 347,
    "rows": 66,
    "columns": 16,
    "formula_count": 33
  }, {"title": "1000", "cell_count": 93, "rows": 29, "columns": 6, "formula_count": 3}, {
    "title": "1400",
    "cell_count": 59,
    "rows": 21,
    "columns": 6,
    "formula_count": 5
  }, {"title": "1850", "cell_count": 30, "rows": 15, "columns": 7, "formula_count": 5}, {
    "title": "2300",
    "cell_count": 20,
    "rows": 13,
    "columns": 7,
    "formula_count": 6
  }, {"title": "2385", "cell_count": 55, "rows": 20, "columns": 8, "formula_count": 5}, {
    "title": "4050",
    "cell_count": 50,
    "rows": 20,
    "columns": 7,
    "formula_count": 5
  }, {"title": "2385a", "cell_count": 39, "rows": 10, "columns": 14, "formula_count": 1}, {
    "title": "6300",
    "cell_count": 41,
    "rows": 17,
    "columns": 7,
    "formula_count": 6
  }, {"title": "6400", "cell_count": 30, "rows": 15, "columns": 6, "formula_count": 5}, {
    "title": "SS&C Fees",
    "cell_count": 115,
    "rows": 35,
    "columns": 11,
    "formula_count": 4
  }]
  },
  isLoading: false
};

const getters = {

};

const actions = {
  async loadWorkbookSummary(context, document_id) {
    context.commit('SET_LOADING', true);
    let response;
    try {
      response = await api().get(URL + document_id);
    } catch (e) {
      context.commit('SET_MESSAGE', e, 'error');
      return
    }
    // context.commit('SET_WORKBOOK_SUMMARY', response['data']);
    console.log('response', response.data)
    return response['data']
  },
};

const mutations = {
  SET_WORKBOOK_SUMMARY(state, data) {
    state.workbookSummary = data;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
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
