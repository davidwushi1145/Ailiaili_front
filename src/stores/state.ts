import AdIcon from '@/components/atoms/icons/AdIcon.vue'
import HomeIconVue from '@/components/atoms/icons/HomeIcon.vue'
import PopularIconVue from '@/components/atoms/icons/PopularIcon.vue'

export const ASIDE_MENU = [
  {
    title: '首页',
    icon: markRaw(HomeIconVue),
    to: '/home',
  },
  {
    title: '热门',
    icon: markRaw(PopularIconVue),
    to: '/popular',
  },
  // {
  //   title: '关注动态',
  //   icon: markRaw(DynamicIconVue),
  //   to: '/dynamic',
  // },
  // {
  //   title: '历史记录',
  //   icon: markRaw(HistoryIconVue),
  //   to: '/history',
  // },
  {
    title: '广告投放平台',
    icon: markRaw(AdIcon),
    to: 'ad-create',
  },
]

export const START_IDX = 1

export const navStore = defineStore('nav', () => {
  const DEFAULT_CLOSE = false

  const router = useRouter()
  const showDarwer = ref(DEFAULT_CLOSE)
  const activeAsideCollapseName = ref([])

  // reset showDarwer before change route
  router.afterEach(() => {
    showDarwer.value = DEFAULT_CLOSE
  })

  return {
    showDarwer,
    activeAsideCollapseName,
  }
})
