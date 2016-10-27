import Vue from 'vue'
import Cookie from 'vue-cookie'

export default {
  login () {
    return Vue.http.post(
      'http://localhost:8081/api/v1/auth',
      { username: 'noonie2k', password: 'abc123' }
    )
    .then((response) => {
      Cookie.set('auth-access', response.headers.get('X-Access-Token'), 1)
      Cookie.set('auth-refresh', response.headers.get('X-Refresh-Token'), 1)

      return Promise.resolve()
    })
  },

  refresh (refreshToken) {
    return Vue.http.post('http://localhost:8081/api/v1/refresh', { }, {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    }).then((response) => {
      Cookie.set('auth-access', response.headers.get('X-Access-Token'), 1)
      Cookie.set('auth-refresh', response.headers.get('X-Refresh-Token'), 1)

      return Promise.resolve()
    })
  }
}
