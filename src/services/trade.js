
import Vue from 'vue'
import api from 'Api'

const URL = '/trade'

const state = {
  trades: [],
  activeTrade: {}
}

const status = {
  tradesLoading: false
}

const getters = {
  trades: state => {
    return state.trades
  },
  activeTrade: state => {
    return state.activeTrade
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

function handleTradeLoad(context, response) {
  const trades = response['data']
  status.tradesLoading = false
  if (trades['error']) {
    context.commit('apiError', trades['error'])
  } else {
    context.commit('tradesLoaded', trades)
  }
}

function handleTradeSave(context, response) {
  const  trade = response['data']
  if (trade['error']) {
    context.commit('apiError', trade['error'])
  } else {
    context.commit('tradeSuccess', trade)
  }
}

function handleTradeDelete(context, id, response) {
  const trade = response['data']
  if (trade['error']) {
    context.commit('apiError', trade['error'])
  } else {
    context.commit('tradeDeleted', id)
  }
}

function handleGetTrade(context, response) {
  const trade = response['data']
  if (trade['error']) {
    context.commit('apiError', trade['error'])
  } else {
    context.commit('setActiveTrade', trade)
  }
}

function addIfPresent(source, destination, propertyName) {
  if (source[propertyName]) {
    destination[propertyName] = source[propertyName]
  }
}

const actions = {
  loadTrades(context, id) {
    if (status.tradesLoading) {
      return
    }
    status.tradesLoading = true
    get(context, URL + '/project/' + id, handleTradeLoad)
  },
  saveTrade(context, payload) {
    const tradeData = {
      'version': payload['version'],
      'user_id': payload['user_id'],
      'name': payload['name'],
      'description': payload['description'],
      'project_id': payload['project_id'],
    }
    addIfPresent(payload, tradeData, 'entity_id')
    if (payload['entity_id']) {
      put(context, tradeData, handleTradeSave)
    } else {
      post(context, URL, payload, handleTradeSave)
    }
  },
  deleteTrade(context, id) {
    apiDelete(context, URL, id, handleTradeDelete)
  },
  getTrade(context, id) {
    get(context, URL + '/' + id, handleGetTrade)
  }
}

const mutations = {
  tradesLoaded(state, trades) {
    state.trades = []
    for (let i = 0; i < trades.length; i++) {
      state.trades.push(trades[i])
    }
  },
  tradeSuccess(state, trade) {
    for (let i = 0; i < state.trades.length; i++) {
      if (state.trades[i].entity_id == trade.entity_id) {
        state.trades.splice(i, 1)
      }
    }
    state.trades.push(trade)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Trade Saved'
    })
  },
  tradeDeleted(state, id) {
    for (let i = 0; i < state.trades.length; i++) {
      if (state.trades[i].entity_id == id) {
        state.trades.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Trade deleted'
        })
      }
    }
  },
  setActiveTrade(state, trade) {
    state.activeTrade = trade
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'TradeTrade'
}
