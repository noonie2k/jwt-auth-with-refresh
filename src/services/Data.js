import Vue from 'vue'

export default {
  getUnrestrictedData () {
    return Vue.http.get('http://localhost:8081/api/v1/unrestricted')
    .then((response) => {
      return Promise.resolve(response.body)
    })
  },

  getRestrictedData () {
    return Vue.http.get('http://localhost:8081/api/v1/restricted')
    .then((response) => {
      return Promise.resolve(response.body)
    })
    .catch((response) => {
      return Promise.reject(response.status)
    })
  }
}
