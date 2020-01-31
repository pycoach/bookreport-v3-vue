<template>
  <v-col sm="12" md="5" lg="5">
    <v-card>
      <v-toolbar>
        <v-card-title v-if="editMode === 'Create'" class="headline">
          {{ editMode }} Project
        </v-card-title>
        <v-card-title v-else class="headline">
          Description
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn 
          v-if="!editDescriptionMode && editMode !== 'Create'" 
          class="ml-5 btn-grey btn-grey--square"
          @click="editDescription"
        >
          <img src="../../../assets/icons/edit-pencil.svg" alt="">
        </v-btn>
      </v-toolbar>
      <v-container grid-list-xl fluid>
        <v-layout row wrap>
          <v-flex xs12 md12 v-if="editMode === 'Create' || editDescriptionMode">
            <v-text-field 
              label="Name"
              clearable
              class="px-3 mt-4"
              :value="name"
              @input="$store.commit('ProjectEditor/setName', $event)"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 md12>
            <v-textarea 
              ref="description" 
              class="description px-3"
              :class="{'no-edit-mode': !editDescriptionMode && editMode === 'Edit'}" label="Description"
              :value="description"
              @input="$store.commit('ProjectEditor/setDescription', $event)"
              outlined
              auto-grow
              rows="4"
              row-height="30"
            >
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions v-if="editMode === 'Create' || editDescriptionMode" class="pa-5">
        <v-spacer></v-spacer>
        <v-btn v-if="editMode === 'Create'" color="primary" text @click="$router.push('/Project')">
          CANCEL
        </v-btn>
        <v-btn v-if="editMode === 'Edit'" color="primary" text @click="editDescriptionOff(true)">
          CANCEL
        </v-btn>
        <v-btn 
          class="ml-5 btn-primary btn-primary--small"
          text
          :disabled="activeProjectIsLoading"
          :loading="activeProjectIsLoading"
          @click="emitSave(name, description)"
        >
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
  import {mapGetters, mapState} from "vuex";
export default {
name: 'Description',
  computed: {
    ...mapGetters(['activeProjectIsLoading']),
    ...mapState('ProjectEditor', ['editMode', 'name', 'description'])
  },
  data() {
    return {
      preservedName: '',
      editDescriptionMode: false,
      preservedDescription: '',
    }
  },
  methods: {
    emitSave (name, description) {
      this.$emit('onSave', { name, description })
    },
    editDescription() {
      this.editDescriptionMode = true;
      const theElement = this.$refs.description.$el;
      this.preservedName = this.name;
      this.preservedDescription = this.description;
      const input = theElement.querySelector('input:not([type=hidden]),textarea:not([type=hidden])');
      if (input) {
        setTimeout(() => {
          input.focus()
        }, 0)
      }
    },
    editDescriptionOff(revert) {
      if (revert) {
        this.description = this.preservedDescription;
        this.$store.commit('ProjectEditor/setName', this.preservedName);
      }
      this.editDescriptionMode = false;
    }
  }
}
</script>

<style scoped>

</style>