import EventEmitter from 'eventemitter3'

class AuthService {

  constructor() {
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.authenticated = this.isAuthenticated()
    this.authNotifier = new EventEmitter()
  }

  isAuthenticated() {
    let expiresAtValue = localStorage.getItem('expires_at')
    if (!expiresAtValue || expiresAtValue == 'NaN') {
      localStorage.removeItem('expires_at')
      localStorage.removeItem('user')
      return false
    }
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    const now = new Date().getTime()
    return now < expiresAt
  }
}

export default AuthService