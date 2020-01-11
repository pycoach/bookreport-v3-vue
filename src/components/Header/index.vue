<template>
  <nav >
    <v-app-bar v-if="false"
      app
      flat
      fixed
      class="primary white--text">
      <v-toolbar-title
        class="text-uppercase">
        <span class="font-weight-light">Book</span>
        <span>Report</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        @click="$router.push('/session/signup').catch(err => {})"
        v-if="!isUserLoggedIn"
        depressed
        class="primary pa-3">
        Sign Up
        <v-icon right>person_add</v-icon> 
      </v-btn>
      <v-divider
        v-if="!isUserLoggedIn"
        class="mx-4"
        vertical>
      </v-divider>
      <v-btn
        @click="$router.push('/session/login').catch(err => {})"
        v-if="!isUserLoggedIn"
        depressed
        class="primary pa-3">
        Login
        <v-icon right>exit_to_app</v-icon> 
      </v-btn>
      <v-divider
        v-if="!isUserLoggedIn"
        class="mx-4"
        vertical>
      </v-divider>
      Version: {{version}}
    </v-app-bar>
    <Navbar :drawer=drawer v-if="!$route.meta.hideNavigation" />
  </nav>
</template>

<script>
import Navbar from '../Navbar'

export default {
  name: 'Header',
  components: {
    Navbar
  },
  mounted() {
    if(localStorage.getItem('user')){
      this.isUserLoggedIn = true
    } else {
      this.isUserLoggedIn = false
    }
  },
  data() {
    return {
      drawer: false,
      version: '3.0.0',
      isUserLoggedIn: false,
    }
  },
}

</script>