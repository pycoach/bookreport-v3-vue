import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import vuetify from './plugins/vuetify'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import AuthService from './auth/AuthService'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// Importing all css styles
import './lib/globalCss'

import CKEditor from '@ckeditor/ckeditor5-vue'

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
});
router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    next()
});

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
    // Complete the animation of the route progress bar.
    NProgress.done()
});

Vue.config.productionTip = false;

Vue.use(Notifications, { velocity });
Vue.use( CKEditor );

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
