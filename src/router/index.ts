import { type NavigationGuardNext, type RouteLocationNormalized, createRouter, createWebHashHistory } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { logout } from '@/utils/logout'
import HomeViewVue from '@/views/HomeView.vue'
import NProgress from '@/utils/nprogress'
import RcmdVideosView from '@/views/RcmdVideosView.vue'
import PopularVideosView from '@/views/PopularVideosView.vue'
import DynamicFeedView from '@/views/DynamicFeedView.vue'
import HistoryVideosView from '@/views/HistoryVideosView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      name: 'Home',
      component: HomeViewVue,
      children: [
        {
          path: '/home',
          name: 'HomeRcmd',
          component: RcmdVideosView,
          meta: {
            keepAlive: true,
          },
        },
        {
          path: '/popular',
          name: 'Popular',
          component: PopularVideosView,
        },
        {
          path: '/dynamic',
          name: 'Dynamic',
          component: DynamicFeedView,
          beforeEnter: (_from, to, next) => {
            handleUnLogin(to, next)
          },
        },
        {
          path: '/history',
          name: 'Hisrory',
          component: HistoryVideosView,
          beforeEnter: (_from, to, next) => {
            handleUnLogin(to, next)
          },
        },
      ],
    },
    {
      path: '/watch',
      name: 'Wathch',
      component: () => import('@/views/WatchView.vue'),
    },
    {
      path: '/space/:mid',
      name: 'Space',
      component: () => import('@/views/SpaceView.vue'),
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/logout',
      name: 'Logout',
      redirect: '',
      beforeEnter: async (_from, _to, next) => {
        await userStore().deleteData()
        await logout()
        next('/home')
      },
    },
    {
      path: '/uploadVideo',
      name: 'UploadVideo',
      component: () => import('@/views/UploadVideoView.vue'),
    },
    {
      path: '/editUserInfo',
      name: 'EditUserInfo',
      component: () => import('@/views/EditUserInfoView.vue'),
    },
    {
      path: '/managePlatform',
      name: 'ManagePlatform',
      component: () => import('@/views/ManagePlatformView.vue'),
    },
    {
      path: '/ad-create',
      name: 'AdCreate',
      component: () => import('@/views/AdCreateView.vue'),
    },
    {
      path: '/chat/:mid',
      name: 'Chat',
      component: () => import('@/views/ChatView.vue'),
      props: true,
    },
  ],
})

function handleUnLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const cookie = useCookies()
  const isLogin = cookie.get('bili_jct') !== undefined

  if (isLogin) {
    next()
  }
  else {
    ElMessage({
      message: 'Please login before continuing',
      grouping: true,
      type: 'warning',
      showClose: true,
    })
    next(to.path)
  }
}

router.beforeEach((_to, _from, next) => {
  NProgress.start()

  next()
})
router.afterEach((_to, _from) => {
  window.scrollTo(0, 0)

  NProgress.done()
})

export default router
