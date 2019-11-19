<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-sheet width="400" height="400" elevation="5" :tile="false">
        <h1 class="primary pa-5 white--text">Enter your details to Login</h1>
        <v-form v-model="valid" class="mb-4">
        <v-text-field
          class="pa-3"
          label="Email"
          v-model="email"
          required
          :rules="emailRules"
          validate-on-blur>
        </v-text-field>
        <v-text-field
          class="pa-3"
          label="Password"
          v-model="password"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-1"
          @click:append="showPassword = !showPassword"
          validate-on-blur
          v-on:keyup.enter="submit">
        </v-text-field>
        </v-form>
        <v-row justify="space-around">
          <v-btn
            depressed
            @click="submit">
            Login
            <v-icon right>exit_to_app</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="space-around">
          <a class="pa-3" @click="$router.push('/session/reset-password')">Forgot Password?</a>
          <a class="pa-3" @click="$router.push('/session/signup')">Don't have an account?</a>
        </v-row>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: {
          required: value => !!value || 'Password is required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },
      showPassword: false,
    }
  },
  methods: {
    async submit() {
      const user = {
        username: this.email,
        password: this.password,
        redirect: '/dashboard',
        refresh: true
      }
      this.$store.dispatch('signInUserApi', user)
    },
  },
  watch: {}
}
</script>