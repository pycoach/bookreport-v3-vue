import Vue from 'vue'
import api from 'Api'

const URL = '/search';
const state = {
  searchType: 'basic',
  projectId: '',
  searchOptions: {},
  searchLastPayload: {},
  documents: [],
  filesCount: 0,
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
  console.log('[Vuex] documents', documents);
  if (documents['error']) {
    context.commit('apiError', documents['error'])
  } else {
    context.commit('setDocuments', documents.files)
    context.commit('setFilesCount', documents.total_files.value)
  }
}

const actions = {
  loadDocuments(context, payload) {
    const newPayload = { ...payload,
      current_page: context.state.searchOptions.page,
      page_size: context.state.searchOptions.itemsPerPage,
      is_project_files_only: true,
      file_size: null
    };
    // Delete the property when the value is empty
    for (let key in newPayload) {
      if (newPayload[key] === '') delete newPayload[key]
    }
    context.commit('setLastPayload', newPayload);
    context.commit('setLoading', true);
    post(context, URL, newPayload, handleDocumentLoad)
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
    state.searchLastPayload = payload;
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'ProjectDocuments'
}
