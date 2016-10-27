<template>
  <div>
    <button @click="login">Login</button>
    <button @click="getRestrictedData">Restricted</button>
    <button @click="getUnrestrictedData">Unrestricted</button>
  </div>
</template>

<script>
import AuthService from '../services/Auth.js'
import DataService from '../services/Data.js'

export default {
  name: 'data',

  methods: {
    login () {
      AuthService.login()
      .then((response) => {
        console.log('login')
      })
      .catch((err) => {
        console.log(err)
      })
    },
    getRestrictedData () {
      DataService.getRestrictedData().then((data) => { console.log(data) }).catch((err) => { console.error(err) })
    },
    getUnrestrictedData () {
      DataService.getUnrestrictedData().then((data) => { console.log(data) }).catch((err) => { console.error(err) })
    }
  }
}
</script>
