<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-sheet width="400" height="500" elevation="5" :tile="false">
        <h1 class="primary pa-5 white--text">Enter your details to Sign Up</h1>
        <v-form v-model="valid" class="mb-4">
        <v-text-field
          class="pa-3"
          label="Name"
          v-model="name"
          required
          :rules="nameRules"
          validate-on-blur>
        </v-text-field>
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
          :rules="[passwordRules.required, passwordRules.min]"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-1"
          hint="At least 8 characters"
          counter
          @click:append="showPassword = !showPassword"
          validate-on-blur
          v-on:keyup.enter="submit">
        </v-text-field>
        </v-form>
        <v-row justify="space-around">
          <v-btn
            :disabled="signUpDisabled"
            depressed
            @click="submit">
            Sign Up
            <v-icon right>person_add</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="space-around">
          <a class="pa-3" @click="$router.push('/session/login')">Already have an account?</a>
        </v-row>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SignUp',
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
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
      signUpDisabled: false,
      checkError: false
    }
  },
  methods: {
    async submit(){
      this.signUpDisabled = true
      const store = this.$store
      let checkError = this.checkError
      const user = {
        username: this.email,
        name: this.name,
        password: this.password,
        redirect: '/dashboard',
        refresh: true
      }
      await this.$store.dispatch('signUpUserApi', user).then(function(response){
        const userData = response['data']
        if (userData['error']) {
          checkError = true
          store.commit('apiError', userData['error'])
        } else {
          store.dispatch('signInUserApi', user)
        }
      })
      if (checkError) {
        this.signUpDisabled = false
        checkError = false
      }
    }
  },
  watch: {}
}
</script>