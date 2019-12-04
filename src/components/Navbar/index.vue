<template>
  <v-navigation-drawer
    app
    expand-on-hover
    permanent
    class="primary
    darken-1">
    <template v-slot:prepend v-if="user!=null">
      <v-list>
        <v-list-item>
          <v-list-item-avatar size="50">
            <v-img :src="user.picture"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item
          two-line>
          <v-list-item-content>
            <v-list-item-title class="white--text title">{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle class="white--text">{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-menu
            :offset-y="true"
            transition="slide-y-transition"
            bottom
            left>
            <template v-slot:activator="{ on }">
              <v-btn icon depressed v-on="on">
                <v-icon class="white--text">arrow_drop_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                @click="$router.push(`${profileEditor.path}`).catch(err => {})">
                <v-list-item-icon>
                  <v-icon right>{{ profileEditor.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ profileEditor.name }}</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="logoutUser()">
                <v-list-item-icon>
                  <v-icon right>exit_to_app</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Log Out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
    </template>
    <v-divider></v-divider>
    <v-list
      nav
      dense>
      <v-list-item v-for="link in links"
        :key="link.name"
        link
        @click="$router.push(`${link.path}`).catch(err => {})">
        <v-list-item-icon>
          <v-icon dark right>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text">{{ link.name }}</v-list-item-title>
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