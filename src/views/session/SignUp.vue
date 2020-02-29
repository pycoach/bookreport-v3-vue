
<template>
  <v-container fluid pa-0 id="signup">
      <v-layout row wrap>
         <Intro>
        </Intro>
        <v-flex xs12 md7 lg8 style="display: flex; align-items: center; justify-content: center;">  
          <div >
           <v-sheet id="login-sheet" >
            <div class="login-block"> 
              <h1>Welcome to BookReport </h1> 
              <p >Sign up by entering the information below </p>
            </div>
        <v-form v-model="valid" class="mb-4">
        <v-text-field
          label="Name*"
          v-model="name"
          required
          placeholder="John Smith"
          :rules="nameRules"
          validate-on-blur>
        </v-text-field>
        <v-text-field
          label="Email*"
          v-model="email"
          placeholder="mail@user.com"
          required
          :rules="emailRules"
          validate-on-blur>
        </v-text-field>
        <v-text-field
          label="Password*"
          placeholder="••••••••••••••"
          v-model="password"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :rules="[rules.required, rules.password]"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-1"
          hint="At least 8 characters"
          counter
          @click:append="showPassword = !showPassword"
          validate-on-blur
          v-on:keyup.enter="submit">
        </v-text-field>
        </v-form>
         
          <v-btn
            :disabled="signUpDisabled || !validPassword"
            depressed
            :class="{'no-shadow': signUpDisabled}"
            class="primary button-login"
                style="width: 100%"
            @click="submit">
              <img  class="ma-2" src="../../assets/icons/login-lock.svg" alt="">
            Sign Up
            <v-progress-circular 
                v-if="signUpDisabled"
                style="position: absolute; right: 30%;"
                indeterminate
                :size="22"
                color="#fff"
              ></v-progress-circular>
          </v-btn>
          <div class="mt-5 text-center" >
            <div class="text-center account" style="border: 1px solid grey">
                   <span class="fs-13 dark-grey-text ">Already have an account?</span> <a class="text-right remember fs-13 " @click="$router.push('/session/login')">Login</a>
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
export default {
  name: 'SignUp',
    components: {
      Intro
  },
  computed: {
    validPassword: function(){
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      return pattern.test(this.password)
    }
  },
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
      rules: {
        required: value => !!value || "Required.",
        password: value => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          return (
            pattern.test(value) ||
            "Min. 8 characters with at least one capital letter, a number and a special character."
          );
        }
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