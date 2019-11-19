import axios from 'axios'

export default () => {
  const headers = { 'content-type': 'application/json' }
  const userString = localStorage.getItem('user')
  if (userString) {
    let user = JSON.parse(userString)
    headers['authorization'] = 'Bearer ' + user['id_token']
  }
  let axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API,
    headers: headers,
    crossdomain: true
  })
  return axiosInstance
}