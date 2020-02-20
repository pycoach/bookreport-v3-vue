
import Vue from 'vue'
import api from 'Api'

const URL = '/report-object'

const state = {
  report_objects: [],
  activeReport_object: {}
}

const status = {
  report_objectsLoading: false
}

const getters = {
  report_objects: state => {
    return state.report_objects
  },
  activeReport_object: state => {
    return state.activeReport_object
  }
}

function get(context, URL, handler) {
  return api().get(URL).then(response => handler(context, response))
}

function post(context, URL, data, handler) {
  return api().post(URL, data).then(response => handler(context, response))
}

function put(context, data, handler) {
  return api().put(URL, data).then(response => handler(context, response))
}

function apiDelete(context, URL, id, handler) {
  api().delete(URL + '/' + id).then(response => handler(context, id, response))
}

function handleReport_objectLoad(context, response) {
  const report_objects = response['data']
  status.report_objectsLoading = false
  if (report_objects['error']) {
    context.commit('apiError', report_objects['error'])
  } else {
    context.commit('report_objectsLoaded', report_objects)
  }
}

function handleReport_objectSave(context, response) {
  const  report_object = response['data']
  if (report_object['error']) {
    context.commit('apiError', report_object['error'])
  } else {
    context.commit('report_objectSuccess', report_object)
  }
  return report_object
}

function handleReport_objectDelete(context, id, response) {
  const report_object = response['data']
  if (report_object['error']) {
    context.commit('apiError', report_object['error'])
  } else {
    context.commit('report_objectDeleted', id)
  }
}

function handleGetReport_object(context, response) {
  const report_object = response['data']
  if (report_object['error']) {
    context.commit('apiError', report_object['error'])
  } else {
    context.commit('setActiveReport_object', report_object)
  }
  return report_object
}

function addIfPresent(source, destination, propertyName) {
  if (source[propertyName]) {
    destination[propertyName] = source[propertyName]
  }
}

const actions = {
  loadReport_objects(context, project_id) {
    if (status.report_objectsLoading) {
      return
    }
    if ( project_id ) {
      status.report_objectsLoading = true
      get(context, URL + '/project/' + project_id, handleReport_objectLoad)
    }
  },
  saveReport_object(context, payload) {
    if (payload['entity_id']) {
      return put(context, payload, handleReport_objectSave)
    } else {
      return post(context, URL, payload, handleReport_objectSave)
    }
  },
  deleteReport_object(context, id) {
    apiDelete(context, URL, id, handleReport_objectDelete)
  },
  getReport_object(context, id) {    
    return get(context, URL + '/' + id, handleGetReport_object)
  }
}

const mutations = {
  report_objectsLoaded(state, report_objects) {    
    state.report_objects = []
    for (let i = 0; i < report_objects.length; i++) {
      state.report_objects.push(report_objects[i])
    }
  },
  report_objectSuccess(state, report_object) {
    for (let i = 0; i < state.report_objects.length; i++) {
      if (state.report_objects[i].entity_id == report_object.entity_id) {
        state.report_objects.splice(i, 1)
      }
    }
    state.report_objects.push(report_object)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Report object Saved'
    })
  },
  report_objectDeleted(state, id) {
    for (let i = 0; i < state.report_objects.length; i++) {
      if (state.report_objects[i].entity_id == id) {
        state.report_objects.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Report object deleted'
        })
      }
    }
  },
  setActiveReport_object(state, report_object) {
    state.activeReport_object = report_object
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'reportobjectReportobject'
}
