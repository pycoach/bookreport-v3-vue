<template>
  <v-app>
    <Header />
    <v-content :class="$route.meta.contentClassName">
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
};
</script>