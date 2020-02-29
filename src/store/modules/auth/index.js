
import Vue from 'vue'
import api from 'Api'

import jwtDecode from 'jwt-decode'
import router from '../../../router'

const state = {
  user: JSON.parse(localStorage.getItem('user')),
  loading: false
}

const getters = {
  user: state => {
    return state.user
  }
}

function setUserLocalStorage(state, userData) {
  let user = JSON.parse(localStorage.getItem('user'))

  user['email'] = userData['email']
  user['picture'] = userData['picture']
  user['name'] = userData['name']
  user['affiliate_id'] = userData['affiliate_id']
  user['nickname'] = userData['nickname']
  user['entity_id'] = userData['entity_id']
  user['user_id'] = userData['user_id']
  user['email_verified'] = userData['email_verified']
  state.user = user
  localStorage.setItem('user', JSON.stringify(user))
}

const actions = {
  signUpUserApi(context, payload) {
    return api(false).post('/signup', {
      'email': payload.username,
      'name': payload.name,
      'password': payload.password
    })
  },
 signInUserApi(context, payload){
    const user = payload
    state.loading = true
      api(false).post('/login', {
      'username': user.username,
      'password': user.password
    }).then( async function (response) {
      const userData = response['data']
      if (userData['error']) {
        state.loading = false
        state.loginDisabled = false
        context.commit('apiError', userData['error'])
      } else {
        userData['redirect'] =   user.redirect
        context.dispatch('getUserLogin', userData)
      }
    })
  },
  signOutUserFromApi(context) {
    context.commit('logoutUser')
  },
  resetPassword(context, email) {
    api(false).post('/password-reset', {
      'email': email
    }).then(function (response) {
      const userData = response['data']
      if (userData['error']) {
        context.commit('apiError', userData['error'])
      } else {
        context.commit('resetPasswordSuccess', userData)
      }
    })
  },
  updateProfile(context, profile) {
    api(false).put('/user', profile).then(function (response) {
      const userData = response['data']
      if (userData['error']) {
        context.commit('apiError', userData['error'])
      } else {
        context.commit('profileSuccess', userData)
      }
    })
  },
  getUserLogin(context, user) {
    const redirect = user.redirect    
    delete user.redirect
    delete user.password
    localStorage.setItem('user', JSON.stringify(user))
    api(false).get('/user').then(function (response) {
      let userData = response['data']
      setUserLocalStorage(state, userData)
      let token = user['id_token']
      let decoded = jwtDecode(token);
      let expires_at = decoded.exp * 1000;
      localStorage.setItem('expires_at', expires_at)
      window.location = redirect
      setTimeout(function () {
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'User Logged In'
        })
      }, 1500)
    })
  },
}

const mutations = {
  loginUserSuccess(state, user) {
  },
  apiError(state, error) {
    Vue.notify({
      group: 'loggedIn',
      type: 'error',
      duration: 5000,
      text: error
    })
  },
  logoutUser(state) {
    state.user = null
    localStorage.removeItem('user')
    localStorage.removeItem('expires_at')
    window.location = '/session/login'
  },
  resetPasswordSuccess(state) {
    if (!state.user) {
      router.push('/session/login')
    }
    setTimeout(function () {
        Vue.notify({
            group: 'loggedIn',
            type: 'success',
            text: 'If your email is registered in our system, you’ll receive instructions on how to reset your password.'
        })
    }, 1500)
  },
  profileSuccess(state, user) {
    setUserLocalStorage(state, user);
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      text: 'Profile Updated'
    });
    location.reload();
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
