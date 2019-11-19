import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import vuetify from './plugins/vuetify'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import AuthService from './auth/AuthService'

router.beforeEach((to, from, next) => {
  const auth = new AuthService()
  const authenticated = auth.authenticated
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('user') === null || !authenticated) {
      next ({
        path: '/session/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
	setTimeout(() => {
		const contentWrapper = document.querySelector(".v-content__wrap");
		if (contentWrapper !== null) {
			contentWrapper.scrollTop = 0;
		}
		const boxedLayout = document.querySelector('.app-boxed-layout .app-content');
		if (boxedLayout !== null) {
			boxedLayout.scrollTop = 0;
		}
		const miniLayout = document.querySelector('.app-mini-layout .app-content');
		if (miniLayout !== null) {
			miniLayout.scrollTop = 0;
		}
	}, 200);
})

Vue.config.productionTip = false

Vue.use(Notifications, { velocity })

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')