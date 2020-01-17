
import Vue from 'vue'
import api from 'Api'

const URL = '/topic'

const state = {
  topics: [],
  activeTopic: {},
}

const status = {
  topicsLoading: false
}

const getters = {
  topics: state => {
    return state.topics
  },
  activeTopic: state => {
    return state.activeTopic
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

function handleTopicLoad(context, response) {
  const topics = response['data']
  status.topicsLoading = false
  if (topics['error']) {
    context.commit('apiError', topics['error'])
  } else {
    context.commit('topicsLoaded', topics)
  }
}

function handleTopicSave(context, response) {
  const  topic_type = response['data']
  if (topic_type['error']) {
    context.commit('apiError', topic_type['error'])
  } else {
    context.commit('topicSuccess', topic_type)
  }
  return topic_type
}

function handleTopicDelete(context, id, response) {
  const topic_type = response['data']
  if (topic_type['error']) {
    context.commit('apiError', topic_type['error'])
  } else {
    context.commit('topicDeleted', id)
  }
}

function handleGetTopic(context, response) {
  const topic_type = response['data']
  if (topic_type['error']) {
    context.commit('apiError', topic_type['error'])
  } else {
    context.commit('setActiveTopic', topic_type)
  }
}


const actions = {
  loadTopics(context, id) {
    if (status.topicsLoading) {
      return
    }
    status.topicsLoading = true
    get(context, URL + '/project/' + id, handleTopicLoad)
  },
  saveTopic(context, payload) {
    if (payload['entity_id']) {
      return put(context, payload, handleTopicSave)
    } else {
      return post(context, URL, payload, handleTopicSave)
    }
  },
  deleteTopic(context, id) {
    apiDelete(context, URL, id, handleTopicDelete)
  },
  getTopic(context, id) {
    get(context, URL + '/' + id, handleGetTopic)
  }
}

const mutations = {
  topicsLoaded(state, topics) {
    state.topics = []
    for (let i = 0; i < topics.length; i++) {
      state.topics.push(topics[i])
    }
  },
  topicSuccess(state, topic_type) {
    for (let i = 0; i < state.topics.length; i++) {
      if (state.topics[i].entity_id == topic_type.entity_id) {
        state.topics.splice(i, 1)
      }
    }
    state.topics.push(topic_type)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Topic Saved'
    })
  },
  topicDeleted(state, id) {
    for (let i = 0; i < state.topics.length; i++) {
      if (state.topics[i].entity_id == id) {
        state.topics.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Topic deleted'
        })
      }
    }
  },
  setActiveTopic(state, topic_type) {
    state.activeTopic = topic_type
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'TopicTopic'
}
