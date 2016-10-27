<template>
  <div id="app">
    <auth-test></auth-test>
  </div>
</template>

<script>
import Hello from './components/Hello'
import AuthTest from './components/AuthTest'

export default {
  name: 'app',
  components: {
    Hello,
    AuthTest
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
