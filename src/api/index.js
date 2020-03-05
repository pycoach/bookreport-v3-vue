import axios from 'axios'
import NProgress from 'nprogress'

function responseSuccess(response) {
  return response;
}

function responseFailure(error) {
  if (window.location.pathname !== "/session/login") {
      window.location = "/session/login";
  }

  return Promise.reject(error);
}

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
  });

  // before a request is made start the nprogress
  axiosInstance.interceptors.request.use(config => {
    NProgress.start();
    return config
  });

// before a response is returned stop nprogress
  axiosInstance.interceptors.response.use(response => {
    NProgress.done();
    return response
  });

  axiosInstance.interceptors.response.use(
    response => responseSuccess(response), error =>
    responseFailure(error));

  return axiosInstance
}
