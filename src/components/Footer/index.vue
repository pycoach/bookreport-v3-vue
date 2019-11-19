<template>
  <v-footer
    color="primary lighten-1"
    padless>
    <v-row
      justify="center"
      no-gutters>
      <v-btn v-for="link in links"
        :key="link.name"
        color="white"
        text
        rounded
        class="my-2"
        @click="$router.push(`${link.path}`).catch(err => {})">
        {{ link.name }}
      </v-btn>
      <v-col
        class="primary lighten-2 py-4 text-center white--text"
        cols="12">
        {{ new Date().getFullYear() }}
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>

export default {
  name: 'Footer',
  data() {
    return {
      links: [
        {name: 'Home', path: '/'},
        {name: 'About Us', path: '/about'}
      ],
    }
  }
}
</script>