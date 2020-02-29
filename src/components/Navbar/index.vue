<template>
  <v-navigation-drawer
    app
    width="216px"
    color="#fff"
    class="">
      <v-list-item>
      <v-list-item-content class="">
        <v-list-item-title class="fs-28 fw-semi-bold d-flex justify-center">
          <img src="../../assets/logos/bookreport-logo-dark.png" alt="">
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line class="d-flex flex-column justify-center user-box ">
      <div class="text-center">
      <v-menu
        :offset-y="true"
        transition="slide-y-transition"
        bottom
        left>
        <template v-slot:activator="{ on }">
          
            <v-list-item-avatar  v-on="on"
      :size="57"
      >
        <img v-if="user" :src="user.picture">
           </v-list-item-avatar>
         
        </template>
        <v-list>
          <v-list-item
            @click="$router.push(`${profileEditor.path}`).catch(err => {})">
            <i class="pe-7s-edit fs-18 delete-button mr-2"  style="color: #A9A9A9"></i>
            <v-list-item-title>{{ profileEditor.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="logoutUser()">
            <i class="pe-7s-back-2 fs-18 delete-button mr-2"  style="color: #A9A9A9"></i>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-list-item-content>
        <v-list-item-title v-if="user" class="user-name">{{ user.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="user" class="user-email" >{{ user.email }}</v-list-item-subtitle>
       
      </v-list-item-content>
      </div>
      
    </v-list-item>
    
    <div class="line-divider"></div>
    
    <v-list
      nav
      dense>
      <v-list-item v-for="(link, index) in links" :class="{itemActive: link.path === $route.path}"
        :key="link.name"
        link
        :ripple="false"
        @click="$router.push(`${link.path}`).catch(err => {})">
         <v-list-item-icon>
          <div v-if="!$route.path.includes('Projecteditor')">
             <div v-if="link.path != $route.path && index == 2" class="navbar-icon-light"  :class="`link-icon-` + index"></div>
             </div>  
          <div v-if="link.path != $route.path && index != 2" class="navbar-icon-light"  :class="`link-icon-` + index"></div>
          <div  v-if="link.path === $route.path "  class="navbar-icon-light"  :class="`link-icon-dark-` + index"></div>  
           <div  v-if="$route.path.includes('Projecteditor') && index == 2 "  class="navbar-icon-light"  :class="`link-icon-dark-` + 2"></div>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title :class="{linkActive: link.path === $route.path  }" >{{ link.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    const req = require.context('../../views/categories', true, /\.(vue)$/i);

    let allCategoriesFiles = req.keys().map(key => {
      const name = key.match(/\w+/)[0];
      return Vue.component(name, req(key))
    })
    for(let i = 0; i < allCategoriesFiles.length; i++) {
      if (!allCategoriesFiles[i].default.name.toLowerCase().includes('editor')) {
        this.links.push({
          name: allCategoriesFiles[i].default.name,
          icon: 'category',
          path: `/${allCategoriesFiles[i].default.name.toLowerCase()}`
        })
      }
    }
  },
  data() {
    return {
      links: [
        { name: 'Home', icon: 'home', path: '/' },
        { name: 'About Us', icon: 'description', path: '/about' }
      ],
      profileEditor: {
        name: 'Edit Profile', icon: 'edit', path: '/editprofile'
      },
    }
  },
  methods: {
    logoutUser() {
      const store = this.$store
      this.$store.dispatch("signOutUserFromApi", this.$router)
    }
  },
  watch: {
  }
}
</script>

<style>
</style>