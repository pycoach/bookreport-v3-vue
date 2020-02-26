import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('Views/Home')
const SignUp = () => import('Views/session/SignUp')
const Login = () => import('Views/session/Login')
const ResetPassword = () => import('Views/session/ResetPassword')
const About = () => import('Views/About')
const Dashboard = () => import('Views/Dashboard')
const ProfileEditor = () => import('Views/ProfileEditor')
const FileViewer = () => import('Views/FileViewer')
const ExcelViewer = () => import('Views/ExcelViewer')

Vue.use(Router)

const req = require.context('../views/categories', true, /\.(vue)$/i);

let allCategoriesFiles = req.keys().map(key => {
  const name = key.match(/\w+/)[0];
  return Vue.component(name, req(key))
})

const categories = []

for(let i = 0; i < allCategoriesFiles.length; i++) {
  if (!allCategoriesFiles[i].default.name.toLowerCase().includes('editor')) {
    const category = {
      path: `/${allCategoriesFiles[i].default.name.toLowerCase()}`,
      name: `${allCategoriesFiles[i].default.name.toLowerCase()}`,
      component: allCategoriesFiles[i].default,
      meta: {
        requiresAuth: true,
        title: `${allCategoriesFiles[i].default.name}`
      }
    }
    categories.push(category)
  }
}

let allEditorsFiles = req.keys().map(key => {
  const name = key.match(/\w+/)[0];
  return Vue.component(name, req(key))
})

const editors = []

for(let i = 0; i < allEditorsFiles.length; i++) {
  if (allEditorsFiles[i].default.name.toLowerCase().includes('editor')) {
    const category = {
      path: `/${allEditorsFiles[i].default.name.toLowerCase()}/:id`,
      name: `${allEditorsFiles[i].default.name.toLowerCase()}`,
      component: allEditorsFiles[i].default,
      props: true,
      meta: {
        requiresAuth: true,
        title: `${allEditorsFiles[i].default.name}`
      }
    }
    editors.push(category)
  }
}

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true,
        title: 'Home'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        requiresAuth: true,
        title: 'About Us'
      }
    },
    {
      path: '/session/signup',
      name: 'signup',
      component: SignUp,
      meta: {
        title: 'BookReport - SignUp',
        hideNavigation: true
      }
    },
    {
      path: '/session/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'BookReport - Login',
        hideNavigation: true
      }
    },
    {
      path: '/session/reset-password',
      name: 'reset-password',
      component: ResetPassword,
      meta: {
        hideNavigation: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: 'Dashboard'
      }
    },
    {
      path: '/editprofile',
      name: 'editprofile',
      component: ProfileEditor,
      meta: {
        requiresAuth: true,
        title: 'Edit Profile'
      }
    },
    {
      path: '/file/viewer/:id/:pageIndex',
      name: 'fileviewer',
      component: FileViewer,
      meta: {
        hideNavigation: true,
        requiresAuth: true,
        title: 'File Viewer',
      },
      props: true
    },
    {
      path: '/excel/viewer/:project_id/:file_id/:file_name',
      name: 'excelviewer',
      component: ExcelViewer,
      meta: {
        hideNavigation: true,
        requiresAuth: true,
        title: 'Excel Viewer',
        contentClassName: 'has-toolbar'
      },
      props: true
    }
  ]
})

router.addRoutes(categories)
router.addRoutes(editors)

export default router