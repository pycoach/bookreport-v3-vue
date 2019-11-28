
import Vue from 'vue'
import api from 'Api'

const URL = '/project'

const state = {
  projects: [],
  activeProject: {}
}

const status = {
  projectsLoading: false
}

const getters = {
  projects: state => {
    return state.projects
  },
  activeProject: state => {
    return state.activeProject
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
  api().delete(URL + "/" + id).then(response => handler(context, id, response));
}

function handleProjectLoad(context, response) {
  const projects = response['data']
  status.projectsLoading = false
  if (projects['error']) {
    context.commit('apiError', projects['error'])
  } else {
    context.commit('projectsLoaded', projects)
  }
}

function handleProjectSave(context, response) {
  const  project = response['data']
  if (project['error']) {
    context.commit('apiError', project['error'])
  } else {
    context.commit('projectSuccess', project)
  }
}

function handleProjectDelete(context, id, response) {
  const project = response['data']
  if (project['error']) {
    context.commit('apiError', project['error'])
  } else {
    context.commit('projectDeleted', id)
  }
}

function handleGetProject(context, response) {
  const project = response['data']
  if (project['error']) {
    context.commit('apiError', project['error'])
  } else {
    context.commit('setActiveProject', project)
  }
}

function addIfPresent(source, destination, propertyName) {
  if (source[propertyName]) {
    destination[propertyName] = source[propertyName]
  }
}

const actions = {
  loadProjects(context, id) {
    if (status.projectsLoading) {
      return
    }
    status.projectsLoading = true
    get(context, URL + '/user_id/' + id, handleProjectLoad)
  },
  saveProject(context, payload) {
    const projectData = {
      'version': payload['version'],
      'user_id': payload['user_id'],
      'name': payload['name'],
      'description': payload['description'],
    }
    addIfPresent(payload, projectData, 'entity_id')

    if (payload['entity_id']) {
      put(context, projectData, handleProjectSave)
    } else {
      post(context, URL, payload, handleProjectSave)
    }
  },
  deleteProject(context, id) {
    apiDelete(context, URL, id, handleProjectDelete)
  },
  getProject(context, id) {
    get(context, URL + '/' + id, handleGetProject)
  }
}

const mutations = {
  projectsLoaded(state, projects) {
    state.projects = []
    for (let i = 0; i < projects.length; i++) {
      state.projects.push(projects[i])
    }
  },
  projectSuccess(state, project) {
    for (let i = 0; i < state.projects.length; i++) {
      if (state.projects[i].entity_id == project.entity_id) {
        state.projects.splice(i, 1)
      }
    }
    state.projects.push(project)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Project Saved'
    })
  },
  projectDeleted(state, id) {
    for (let i = 0; i < state.projects.length; i++) {
      if (state.projects[i].entity_id == id) {
        state.projects.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Project deleted'
        })
      }
    }
  },
  setActiveProject(state, project) {
    state.activeProject = project
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'ProjectProject'
}
