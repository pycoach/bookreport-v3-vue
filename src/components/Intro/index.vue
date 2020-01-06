<template>
    <v-flex xs12 md5 lg4 class="intro-block " style="">
          
          
         <div class="intro-box">
           <div>
             <img  src="../../assets/logos/bookreport-logo-light.png" alt="">
           </div>
            
          <div class="message">
             <h3>
             Valuate, Audit, Report
           </h3> 
           <p>
             Bookreport provides you a professinal toolset for creating reports
             and tracking the process from document upload to final report delivery.  
           </p>
            <div class="fs-12 dark-grey-text copyrights"> 
                <span class="pr-5">Privacy Policy</span>   <span class="px-5">Contact   </span>  <span class="px-5">©2020 BookReport.</span>  <br>
              </div>
          </div>
         </div>
      </v-flex>
</template>

<script>
export default {
  name: 'Intro',
  data() {
    return {
     
    }
  },
   mounted() {
    if(localStorage.getItem('user')){
      this.isUserLoggedIn = true
    } else {
      this.isUserLoggedIn = false
    }
  },
}

  
</script>