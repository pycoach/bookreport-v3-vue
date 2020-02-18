import Vue from 'vue'
import api from 'Api'
import moment from "moment";

const URL = '/search';
const state = {
  searchType: 'basic',
  projectId: '',
  searchOptions: {},
  searchLastPayload: {},
  documents: [],
  filesCount: 0,
  filterByUploadSet: [],
  filterByTrade: [],
  filterByTransaction: [],
  filterByDocumentTypes: [],
  filterByFileSizes: [],
  filterByFileTypes: [],
  isLoading: false
};

const getters = {
  searchType: state => {
    return state.searchType
  },
  searchOptions: state => {
    return state.searchOptions
  },
  searchLastPayload: state => {
    return state.searchLastPayload
  },
  getDocuments: state => {
    return state.documents
  },
  getDocumentsCount: state => {
    return state.filesCount
  },
  documentsLoading: state => {
    return state.isLoading
  }
};

function post(context, URL, data, handler) {
  return api().post(URL, data).then(response => handler(context, response))
}

function handleDocumentLoad(context, response) {
  context.commit('setLoading', false);
  const documents = response['data'];
  if (documents['error']) {
    context.commit('apiError', documents['error'])
  } else {
    context.commit('setDocuments', documents.files);
    context.commit('setFilesCount', documents.total_files.value);
    context.commit('setFilterByUploadSet', documents.file_count_by_uploadset);
    context.commit('setFilterByTrade', documents.file_count_by_trade);
    context.commit('setFilterByTransaction', documents.file_count_by_transaction);
    context.commit('setFilterByDocumentType', documents.file_count_by_document_type);
    context.commit('setFilterByFileSize', documents.file_count_by_size);
    context.commit('setFilterByFileType', documents.file_count_by_type);
  }
}

const actions = {
  loadDocuments(context, payload) {
    const options = {
      file_size: null,
      current_page: context.state.searchOptions.page,
      page_size: context.state.searchOptions.itemsPerPage,
      is_project_files_only: true,
    };
    const oldPayload = context.state.searchLastPayload;
    const newPayload = {
      ...options,
      ...oldPayload,
      ...payload,
    };
    // Delete the property when the value is empty
    for (let key in newPayload) {
      if (key !== 'file_size' && key !== 'page_size' && (newPayload[key] === '' || newPayload[key] === null)) delete newPayload[key]
    }
    context.commit('setLastPayload', newPayload);
    context.commit('setLoading', true);
    post(context, URL, newPayload, handleDocumentLoad)
  },
  async deleteDocument(context, entity_id) {
    let response;
    try {
      response = await api().delete('/request_documents/' + entity_id);
    } catch (e) {
      return
    }
    return response['data']
  }
};

const mutations = {
  setDocuments(state, documents) {
    state.documents = documents;
  },
  setSearchType(state, type) {
    state.searchType = type
  },
  setOptions(state, newOptions) {
    state.searchOptions = newOptions
  },
  setFilesCount(state, filesCount) {
    state.filesCount = filesCount
  },
  setLastPayload(state, payload) {
    state.searchLastPayload = {...state.searchLastPayload, ...payload};
  },
  setFilterByUploadSet(state, response) {
    const uploadSets = [];
    for (let key in response) {
      uploadSets.push({
        value: key,
        count: response[key],
        text: `${response[key]['changed_by']} ${moment(response[key]['start_time']).format('L')} (${response[key]['count']})`
      })
    }
    uploadSets.splice(0, 0, {value: null, text: "All Upload Sets"});
    state.filterByUploadSet = uploadSets;
  },
  setFilterByTrade(state, response) {
    const trades = [];
    for (let key in response) {
      trades.push({
        value: key,
        count: response[key],
        text: `${key} (${response[key]})`
      })
    }
    trades.splice(0, 0, {value: null, text: "All trades"});
    trades.splice(1, 0, {value: "No trade", text: "No trade"});
    state.filterByTrade = trades;
  },
  setFilterByTransaction(state, response) {
    const transactions = [];
    for (let key in response) {
      transactions.push({
        value: key,
        count: response[key],
        text: `${key} (${response[key]})`
      })
    }
    transactions.splice(0, 0, {value: null, text: "All transactions"});
    transactions.splice(1, 0, {value: "No trade", text: "No transaction"});
    state.filterByTransaction = transactions;
  },
  setFilterByDocumentType(state, response) {
    const documentTypes = [];
    for (let key in response) {
      documentTypes.push({
        value: key,
        count: response[key],
        text: `${key} (${response[key]})`
      })
    }
    documentTypes.splice(0, 0, {value: null, text: "All document types"});
    documentTypes.splice(1, 0, {value: "No trade", text: "No document type"});
    state.filterByDocumentTypes = documentTypes;
  },
  setFilterByFileSize(state, response) {
    const fileSizes = [];
    for (let key in response) {
      fileSizes.push({
        value: key,
        text: `${response[key]['name']} (${response[key]['count']})`
      })
    }
    fileSizes.splice(0, 0, {value: null, text: "All file sizes"});
    state.filterByFileSizes = fileSizes;
  },
  setFilterByFileType(state, response) {
    const fileTypes = [];
    for (let key in response) {
      fileTypes.push({
        value: key,
        count: response[key],
        text: `${key} (${response[key]})`
      })
    }
    fileTypes.splice(0, 0, {value: null, text: "All file types"});
    state.filterByFileTypes = fileTypes;
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
  name: 'ProjectDocuments'
}
