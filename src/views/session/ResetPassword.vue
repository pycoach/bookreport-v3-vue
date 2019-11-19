<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-sheet width="400" height="280" elevation="5" :tile="false">
        <h1 class="primary pa-5 white--text">Enter your email address</h1>
        <v-form v-model="valid" class="mb-4">
        <v-text-field
          class="pa-3"
          label="Email"
          v-model="username"
          required
          :rules="emailRules"
          validate-on-blur
          v-on:keyup.enter="submit">
        </v-text-field>
        </v-form>
        <v-row justify="space-around">
          <v-btn
            depressed
            @click="submit">
            Send Email
            <v-icon right>exit_to_app</v-icon>
          </v-btn>
        </v-row>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      valid: false,
      username: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ]
    }
  },
  methods:{
    submit(){
      this.$store.dispatch('resetPassword', this.username)
    }
  }
}
</script>