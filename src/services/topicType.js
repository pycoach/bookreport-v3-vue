
import Vue from 'vue'
import api from 'Api'

const URL = '/topic-type'

const state = {
  topic_types: [],
  activeTopicType: {},
}

const status = {
  topicTypesLoading: false
}

const getters = {
  topic_types: state => {
    return state.topic_types
  },
  activeTopicType: state => {
    return state.activeTopicType
  }
}

function get(context, URL, handler) {
  api().get(URL).then(response => handler(context, response))
}

function post(context, URL, data, handler) {
  return api().post(URL, data).then(response => handler(context, response))
}

function put(context, data, handler) {
  return api().put(URL, data).then(response => handler(context, response))
}

function apiDelete(context, URL, id, handler) {
  api().delete(URL + "/" + id).then(response => handler(context, id, response));
}

function handleTopicTypeLoad(context, response) {
  const topic_types = response['data']
  status.topicTypesLoading = false
  if (topic_types['error']) {
    context.commit('apiError', topic_types['error'])
  } else {
    context.commit('topicTypesLoaded', topic_types)
  }
}

function handleTopicTypeSave(context, response) {
  const  topic_type = response['data']
  if (topic_type['error']) {
    context.commit('apiError', topic_type['error'])
  } else {
    context.commit('topicTypeSuccess', topic_type)
  }
  return topic_type
}

function handleTopicTypeDelete(context, id, response) {
  const topic_type = response['data']
  if (topic_type['error']) {
    context.commit('apiError', topic_type['error'])
  } else {
    context.commit('topicTypeDeleted', id)
  }
}

function handleGetTopicType(context, response) {
  const topic_type = response['data']
  if (topic_type['error']) {
    context.commit('apiError', topic_type['error'])
  } else {
    context.commit('setActiveTopicType', topic_type)
  }
}

function addIfPresent(source, destination, propertyName) {
  if (source[propertyName]) {
    destination[propertyName] = source[propertyName]
  }
}

const actions = {
  loadTopicTypes(context, id) {
    if (status.topicTypesLoading) {
      return
    }
    status.topicTypesLoading = true
    get(context, URL + '/project/' + id, handleTopicTypeLoad)
  },
  saveTopicType(context, payload) {
    if (payload['entity_id']) {
      return put(context, payload, handleTopicTypeSave)
    } else {
      return post(context, URL, payload, handleTopicTypeSave)
    }
  },
  deleteTopicType(context, id) {
    apiDelete(context, URL, id, handleTopicTypeDelete)
  },
  getTopicType(context, id) {
    get(context, URL + '/' + id, handleGetTopicType)
  }
}

const mutations = {
  topicTypesLoaded(state, topic_types) {
    state.topic_types = []
    for (let i = 0; i < topic_types.length; i++) {
      state.topic_types.push(topic_types[i])
    }
  },
  topicTypeSuccess(state, topic_type) {
    for (let i = 0; i < state.topic_types.length; i++) {
      if (state.topic_types[i].entity_id == topic_type.entity_id) {
        state.topic_types.splice(i, 1)
      }
    }
    state.topic_types.push(topic_type)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'TopicType Saved'
    })
  },
  topicTypeDeleted(state, id) {
    for (let i = 0; i < state.topic_types.length; i++) {
      if (state.topic_types[i].entity_id == id) {
        state.topic_types.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'TopicType deleted'
        })
      }
    }
  },
  setActiveTopicType(state, topic_type) {
    state.activeTopicType = topic_type
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'TopicTypeTopicType'
}
