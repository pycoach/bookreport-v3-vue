
import Vue from 'vue'
import api from 'Api'

const URL = '/report'

const state = {
  reports: [],
  activeReport: {}
}

const status = {
  reportsLoading: false
}

const getters = {
  reports: state => {
    return state.reports
  },
  activeReport: state => {
    return state.activeReport
  }
}

function get(context, URL, handler) {
  api().get(URL).then(response => handler(context, response))
}

function post(context, URL, data, handler) {
  api().post(URL, data).then(response => handler(context, response))
}

function put(context, data, handler) {
  api().put(URL, data).then(response => handler(context, response))
}

function apiDelete(context, URL, id, handler) {
  api().delete(URL + '/' + id).then(response => handler(context, id, response))
}

function handleReportLoad(context, response) {
  const reports = response['data']
  status.reportsLoading = false
  if (reports['error']) {
    context.commit('apiError', reports['error'])
  } else {
    context.commit('reportsLoaded', reports)
  }
}

function handleReportSave(context, response) {
  const  report = response['data']
  if (report['error']) {
    context.commit('apiError', report['error'])
  } else {
    context.commit('reportSuccess', report)
  }
}

function handleReportDelete(context, id, response) {
  const report = response['data']
  if (report['error']) {
    context.commit('apiError', report['error'])
  } else {
    context.commit('reportDeleted', id)
  }
}

function handleGetReport(context, response) {
  const report = response['data']
  if (report['error']) {
    context.commit('apiError', report['error'])
  } else {
    context.commit('setActiveReport', report)
  }
}

function addIfPresent(source, destination, propertyName) {
  if (source[propertyName]) {
    destination[propertyName] = source[propertyName]
  }
}

const actions = {
  loadReports(context, project_id) {
    if (status.reportsLoading) {
      return
    }
    if ( project_id ) {
      status.reportsLoading = true
      get(context, URL + '/project/' + project_id, handleReportLoad)
    }
  },
  saveReport(context, payload) {
    const reportData = {
      'project_id': payload['project_id'],
      'name': payload['name'],
      'report_objects': payload['report_objects'],
    }
    if (payload['entity_id']) {
      put(context, reportData, handleReportSave)
    } else {
      post(context, URL, reportData, handleReportSave)
    }
  },
  deleteReport(context, id) {
    apiDelete(context, URL, id, handleReportDelete)
  },
  getReport(context, id) {
    get(context, URL + '/' + id, handleGetReport)
  }
}

const mutations = {
  reportsLoaded(state, reports) {
    state.reports = []
    for (let i = 0; i < reports.length; i++) {
      state.reports.push(reports[i])
    }
  },
  reportSuccess(state, report) {
    for (let i = 0; i < state.reports.length; i++) {
      if (state.reports[i].entity_id == report.entity_id) {
        state.reports.splice(i, 1)
      }
    }
    state.reports.push(report)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Report Saved'
    })
  },
  reportDeleted(state, id) {
    for (let i = 0; i < state.reports.length; i++) {
      if (state.reports[i].entity_id == id) {
        state.reports.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Report deleted'
        })
      }
    }
  },
  setActiveReport(state, report) {
    state.activeReport = report
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'reportReport'
}
