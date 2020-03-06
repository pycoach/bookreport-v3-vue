<template>
  <v-app>
    <Header />
    <v-content :class="$route.meta.contentClassName">
      <span class="version" v-if="showVersion">Version: {{version}}</span>
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
   watch: {
      '$route':{
        handler: (to, from) => {
          document.title = 'BookReport'
        },
         immediate: true
      }
    },
     data () {
  return {
      showVersion: true,
      version: '3.0.3',
      transitionName: 'fade'
    }
  },
};
</script>