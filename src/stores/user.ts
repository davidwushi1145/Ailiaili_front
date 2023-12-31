export interface UserInfo {
  isLogin: boolean
  face: string
  uname: string
  level_info: {
    current_level: number
    current_min: number
    current_exp: number
    next_exp: number | string
  }
  mid: number
  money: number
  following: number
  follower: number
  dynamic_count: number
  moral: number
}

const DEFAULT = {
  isLogin: false,
  face: '',
  uname: '',
  level_info: {
    current_level: 0,
    current_min: 0,
    current_exp: 0,
    next_exp: 0,
  },
  mid: 0,
  money: 0,
  following: 0,
  follower: 0,
  dynamic_count: 0,
  moral: 0,
}

export const userStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>(DEFAULT)

  const fetchData = async () => {
    const res = await getUserInfo()

    if (res.value.isLogin) {
      userInfo.value = {
        ...userInfo.value,
        ...res.value,
      }
    }
    else {
      // reset all data of user
      userInfo.value = DEFAULT
    }
  }

  const deleteData = async () => {
    userInfo.value = {
      isLogin: false,
      face: '',
      uname: '',
      level_info: {
        current_level: 0,
        current_min: 0,
        current_exp: 0,
        next_exp: 0,
      },
      mid: 0,
      money: 0,
      following: 0,
      follower: 0,
      dynamic_count: 0,
      moral: 0,
    }
    await nextTick()
    // eslint-disable-next-line no-console
    console.log('User info after deleteData:', userInfo.value)
  }
  // fetchData()
  // deleteData()

  return {
    userInfo,
    fetchData,
    deleteData,
  }
}, {
  persist: {
    paths: ['userInfo'], // 持久化 userInfo 状态
  },
})
