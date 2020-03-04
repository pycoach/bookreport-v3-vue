
<template >
  <div class='base-y-padding ' id="Projects">
    <v-row >
      <v-col v-for="(project, index) in filteredProjects"  :key="project.entity_id"
        cols="6"
        sm="12"
        md="4"
        lg="3"
      >
      <v-card :ripple="false"  @click="$router.push('/Projecteditor/' + project.entity_id)" >
        <v-toolbar >
          <div>
             <div class="project-title">{{project.name}}</div>
           <div class="project-last-edited">Last edited at {{$moment(project.changed_on).format('LT MM/DD/YYYY')}}</div>
          </div>

              <v-menu @click.native.stop.prevent offset-y >
                <template v-slot:activator="{ on }">
                  <v-btn @click.stop icon style="margin-left: auto"

                    v-on="on"
                  >      <img src="../../../assets/icons/menu-icon.svg" alt="">
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    :key="2"
                     @click="$router.push('/Projecteditor/' + project.entity_id)"
                     >
                     <i class="pe-7s-edit fs-18 delete-button mr-2"  style="color: #A9A9A9"></i>
                     <v-list-item-title>Edit Project</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :key="1"
                    @click.stop="apiDelete(project.entity_id)"
                     >
                     <i class="pe-7s-trash fs-18 delete-button mr-2"  style="color: #A9A9A9"></i>
                    <v-list-item-title color="red">Delete project</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
        </v-toolbar>
         <v-divider></v-divider>
        <v-card-text >
          {{project.description}}
        </v-card-text>
        <v-divider></v-divider>
        <v-container fluid class="tasks-counter">
             <v-row >
             <v-col cols="12" sm="4" class="py-5" >
               <span>12</span>
               <div>Trades</div>
                <!-- Open Tasks: <span> {{getTasksCount(project.entity_id, "In Progress")}}</span> -->
             </v-col>
             <v-col cols="12" sm="4" class="py-5" >
                <span>25</span>
                <div class="transactions">Transactions</div>
                <!-- Done: <span> {{getTasksCount(project.entity_id, "Done")}}</span> -->
             </v-col>
              <v-col cols="12" sm="4" class="py-5" >
                 <span>214</span>
               <div>Files</div>
                <!-- Done: <span> {{getTasksCount(project.entity_id, "Done")}}</span> -->
             </v-col>
           </v-row>
        </v-container>
        <v-divider></v-divider>
           <v-container fluid class="users-block">
             <div class="mt-3">Users</div>
             <v-row >

             <v-col cols="12" sm="12" class="d-flex" >

               <div>
                  <img  src="../../../assets/placeholders/userpic.svg" alt="">
               </div>
               <div>
                  <div class="users-block__name">{{project.users[0].name}}</div>
                  <div class="users-block__role">{{project.users[0].role}}</div>
               </div>
             </v-col>
           </v-row>
        </v-container>

      </v-card>
      </v-col>
    </v-row>
  </div>


</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Project',
  computed: {
    ...mapGetters(['projects', 'user']),

      filteredProjects() {
        return this.projects.filter(project => {

             return project.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
    },

    search() {
      return this.$parent.search
    }

  },
  data() {
    return {

    }
  },
  created() {
    this.$store.dispatch('loadProjects', this.user.entity_id);
  },
  methods: {

    apiDelete(id) {
      this.$store.dispatch('deleteProject', id)
    },
  }
}
</script>
