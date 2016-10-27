import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueResource from 'vue-resource'
import App from './App'
import AuthService from './services/Auth.js'

Vue.use(VueCookie)

Vue.use(VueResource)

// Setup the Token Refresh interceptors
Vue.http.interceptors.push((request, next) => {
  let accessToken = VueCookie.get('auth-access')

  // Set the Access Token in the Request Authorization header
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  // Process the original request
  next((response) => {
    let refreshToken = VueCookie.get('auth-refresh')

    // Check for invalid/expired access token (results in 401)
    if (response.status === 401 && refreshToken) {
      // Attempt to obtain a new Access Token using the Refresh Token
      return AuthService.refresh(refreshToken)
        .then((refreshResponse) => {
          let newAccessToken = VueCookie.get('auth-access')

          // Set the Authorization header on the original request with the new Access Token
          request.headers.set('Authorization', `Bearer ${newAccessToken}`)

          // Execute and return a new attempt at the original request
          return Vue.http(request)
        })
        .catch(() => {
          // User doesn't have a valid Refresh Token; return the original response (401)
          return response
        })
    } else {
      return response
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
