<template>
  <v-app>
    <Header />
    <v-content>
      <router-view></router-view>
      <notifications group="loggedIn" position="top right" animation-type="velocity" />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Footer from './components/Footer'
import Header from './components/Header'

export default {
  name: 'App',
  components: {
    Footer,
    Header
  },
};
</script>