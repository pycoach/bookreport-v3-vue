
import Vue from 'vue'
import api from 'Api'

const URL = '/transaction'

const state = {
  transactions: [],
  activeTransaction: {}
}

const status = {
  transactionsLoading: false
}

const getters = {
  transactions: state => {
    return state.transactions
  },
  activeTransaction: state => {
    return state.activeTransaction
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

function handleTransactionLoad(context, response) {
  const transactions = response['data']
  status.transactionsLoading = false
  if (transactions['error']) {
    context.commit('apiError', transactions['error'])
  } else {
    context.commit('transactionsLoaded', transactions)
  }
}

function handleTransactionSave(context, response) {
  const  transaction = response['data']
  if (transaction['error']) {
    context.commit('apiError', transaction['error'])
  } else {
    context.commit('transactionSuccess', transaction)
  }
}

function handleTransactionDelete(context, id, response) {
  const transaction = response['data']
  if (transaction['error']) {
    context.commit('apiError', transaction['error'])
  } else {
    context.commit('transactionDeleted', id)
  }
}

function handleGetTransaction(context, response) {
  const transaction = response['data']
  if (transaction['error']) {
    context.commit('apiError', transaction['error'])
  } else {
    context.commit('setActiveTransaction', transaction)
  }
}

function addIfPresent(source, destination, propertyName) {
  if (source[propertyName]) {
    destination[propertyName] = source[propertyName]
  }
}

const actions = {
  loadTransactions(context) {
    if (status.transactionsLoading) {
      return
    }
    status.transactionsLoading = true
    get(context, URL, handleTransactionLoad)
  },
  saveTransaction(context, payload) {
    const transactionData = {
      'version': payload['version'],
      'user_id': payload['user_id'],
      'name': payload['name'],
    }
    addIfPresent(payload, transactionData, 'entity_id')
    if (payload['entity_id']) {
      put(context, transactionData, handleTransactionSave)
    } else {
      post(context, URL, payload, handleTransactionSave)
    }
  },
  deleteTransaction(context, id) {
    apiDelete(context, URL, id, handleTransactionDelete)
  },
  getTransaction(context, id) {
    get(context, URL + '/' + id, handleGetTransaction)
  }
}

const mutations = {
  transactionsLoaded(state, transactions) {
    state.transactions = []
    for (let i = 0; i < transactions.length; i++) {
      state.transactions.push(transactions[i])
    }
  },
  transactionSuccess(state, transaction) {
    for (let i = 0; i < state.transactions.length; i++) {
      if (state.transactions[i].entity_id == transaction.entity_id) {
        state.transactions.splice(i, 1)
      }
    }
    state.transactions.push(transaction)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Transaction Saved'
    })
  },
  transactionDeleted(state, id) {
    for (let i = 0; i < state.transactions.length; i++) {
      if (state.transactions[i].entity_id == id) {
        state.transactions.splice(i, 1)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Transaction deleted'
        })
      }
    }
  },
  setActiveTransaction(state, transaction) {
    state.activeTransaction = transaction
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  name: 'TransactionTransaction'
}
