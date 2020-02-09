
import Vue from 'vue'
import api from 'Api'

const URL = '/report'
const DOWNLOAD_URL = '/generate-word-doc'

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
  },
  downloadReport(context, entity_id){
    let url = DOWNLOAD_URL + '/' + entity_id;
    api().get(url).then(response => {
      const reportData = response["data"];
      if (reportData["error"]) {
          context.commit('apiError', reportData["error"])
      } else {
          context.commit('reportDownloaded', reportData);
      }
  });
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
  },
  reportDownloaded(state, reportData){

    const byteCharacters = atob(reportData);
        const byteArrays = [];
        const sliceSize = 512;

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const newBlob = new Blob(byteArrays, { type: "application/octet-stream" });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download = "report.docx";
        link.click();
        setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);        
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'reportReport'
}
