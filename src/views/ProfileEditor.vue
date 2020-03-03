<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-sheet width="400" height="300" elevation="5" :tile="false">
        <v-row justify="space-around">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-avatar size="150">
                <v-img :src="profilePicture">
                </v-img>
                <v-fade-transition>
                  <v-overlay
                    opacity="0.65"
                    v-if="hover"
                    absolute>
                    <v-btn @click="show=true" text>
                      Change Picture
                    </v-btn>
                  </v-overlay>
                </v-fade-transition>
              </v-avatar>
            </template>
          </v-hover>
        </v-row>
        <v-form v-model="valid">
          <v-text-field
            class="pa-3"
            label="Name"
            v-model="name"
            required
            :rules="nameRules"
            validate-on-blur>
          </v-text-field>
        </v-form>
        <v-row justify="space-around">
          <v-btn
            color="green darken-1"
            :disabled="!enablePasswordReset"
            text
            @click="resetPassword">
            Reset Password
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="$router.push('/dashboard')">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="save()">
            Save
          </v-btn>
        </v-row>
        <image-upload
          field="picture"
          @crop-success="cropSuccess"
          v-model="show"
          :width="500"
          :height="200"
          langType="en"
          img-format="png">
        </image-upload>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import imageUpload from 'vue-image-crop-upload'

export default {
  name: 'ProfileEditor',
  components: {
    imageUpload
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.name = this.user.name
    this.profilePicture = this.user.picture
  },
  data() {
    return {
      valid: false,
      show: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      profilePicture: '',
      enablePasswordReset: true,
    }
  },
  methods: {
    save() {
      let userData = {
        entity_id: this.user.entity_id,
        user_id: this.user.user_id,
        affiliate_id: JSON.parse(localStorage.getItem('user')).affiliate_id,
        email: JSON.parse(localStorage.getItem('user')).email,
        email_verified: this.user.email_verified,
        nickname: JSON.parse(localStorage.getItem('user')).nickname,
        blocked: false,
        name: this.name,
        picture: this.profilePicture
      }
      this.$store.dispatch('updateProfile', userData)
    },
    cropSuccess(imgDataUrl) {
      this.profilePicture = imgDataUrl
      this.save()
    },
    async resetPassword() {
      this.enablePasswordReset = false
      await this.$store.dispatch('resetPassword', this.user.email)
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.enablePasswordReset = true
    }
  }

}
</script>