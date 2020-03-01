<template>
  <v-container fluid pa-0 id="login">
      
      <v-layout row wrap>
        <Intro>

        </Intro>
        <v-flex xs12 md7 lg8 style="display: flex; align-items: center; justify-content: center;">  
          <div >
           <v-sheet id="login-sheet" >
            <div class="login-block"> 
              <h1>Enter your email address</h1> 
            </div>
        <v-form v-model="valid" class="mb-4">
        <v-text-field
          label="Email"
          v-model="username"
          required
          :rules="emailRules"
          validate-on-blur
          v-on:keyup.enter="submit">
        </v-text-field>
        </v-form>
          <v-btn
            depressed
            :disabled="!canSubmit()"
            class="primary mt-10  button-login"
            style="width: 100%"
            @click="submit">
            Send Email
            
          </v-btn>
          
      </v-sheet>
          </div>
       </v-flex>  
      
      
    </v-layout>
   
  </v-container>
</template>

<script>
import Intro from '../../components/Intro'
export default {
  name: 'ResetPassword',
   components: {
      Intro
  },
  data() {
    return {
      valid: false,
      username: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(String(v).toLowerCase()) || 'E-mail must be valid',
      ]
    }
  },
  methods:{
    canSubmit() {
      return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(String(this.username).toLowerCase())
    },
    submit(){
      this.$store.dispatch('resetPassword', this.username)
    }
  }
}
</script>