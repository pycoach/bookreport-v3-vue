<template>
  <v-container fluid pa-0 id="login">
      <v-layout row wrap>
          <Intro>

        </Intro>
        <v-flex  xs7 md7 lg8 style="display: flex; align-items: center; justify-content: center;">  
          <div >
           <v-sheet id="login-sheet" >
            <div class="login-block"> 
              <h1>Welcome to Bookreport </h1> 
            <p >Sign in by entering the information below </p>
            </div>
            <v-form v-model="valid" class="">
            <v-text-field
              class="mb-3"
              label="Email"
              v-model="email"
              required
              :rules="emailRules"
              validate-on-blur>
            </v-text-field>
            <v-text-field
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
              <a class="d-block text-right remember" @click="$router.push('/session/reset-password')">Forgot password?</a>
              <v-btn
                depressed
                 :disabled="$store.state.auth.loading"
                class="primary mt-10 button-login"
                style="width: 100%; "
                @click="submit">
                <img  class="ma-2" src="../../assets/icons/login-lock.svg" alt="">
                SIGN IN
                  <v-progress-circular 
                  v-if="$store.state.auth.loading"
                  
                  style="position: absolute; right: 30%;"
                  indeterminate
                  :size="22"
                  color="#fff"
                ></v-progress-circular>
              </v-btn>

              <div class="mt-5 text-center" >
                <div class="text-center account" style="border: 1px solid grey">
                   <span class="fs-13 dark-grey-text ">Don't have an account?</span> <a class="text-right remember fs-13 " @click="$router.push('/session/signup')">Register</a>
                </div>
               
              </div>

           
             
          </v-sheet>
          </div>
       </v-flex>  
      
      
    </v-layout>
   
  </v-container>
</template>

<script>
import Intro from '../../components/Intro'
import {mapState} from 'vuex'
export default {
  name: 'Login',
    components: {
      Intro
  },
   computed: {
    ...mapState(['loading'])
  },
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
      redirect: '/dashboard',
    }
  },
  mounted() {  
    if(this.$route.query['redirect'] !== undefined) {
      this.redirect = this.$route.query.redirect        
      }
  },
  methods: {
    async submit() {
      
      const user = {
        username: this.email,
        password: this.password,
        redirect: this.redirect,
        refresh: true
      }
      this.$store.dispatch('signInUserApi', user)
    },
  },
  watch: {}
}
</script>