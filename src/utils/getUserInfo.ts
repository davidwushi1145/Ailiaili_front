import { UserApiService } from '../../generated'
import type { BaseResponse } from './api'
import type { UserInfo } from '@/stores/user'

interface UserInfoRes extends Omit<BaseResponse, 'data'> {
  data: UserInfo
}

interface UserStatRes extends Omit<BaseResponse, 'data'> {
  data: {
    following: number
    follower: number
    dynamic_count: number
  }
}

// export async function getUserInfo() {
//   const res: UserInfoRes = await fetch(API.userInfo()).then(res => res.json())
//   const statRes: UserStatRes = await fetch(API.userStat()).then(res => res.json())
//
//   res.data = {
//     ...res.data,
//     ...statRes.data,
//   }
//
//   return res
// }

export async function getUserInfo() {
  const user = await UserApiService.getUserInfoUsingGet()
  const coins = await UserApiService.getUserCoinsUsingGet()
  const userFollower = await UserApiService.getFollowersUsingGet()
  const userFollowing = await UserApiService.getUserFollowingUsingGet()
  const flag = ref(false)
  if (user.data !== null)
    flag.value = true

  const res = ref<UserInfo>({
    isLogin: flag.value,
    face: user.data?.userInfo?.avatar as string,
    uname: user.data?.userInfo?.nick as string,
    level_info: {
      current_level: 5,
      current_min: 1000,
      current_exp: 2000,
      next_exp: 5000,
    },
    mid: user.data?.id as number,
    money: coins.data as number,
    following: userFollowing.data as number,
    follower: userFollower.data as number,
    dynamic_count: 30,
    moral: 40,
  })
  return res
}
