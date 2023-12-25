import { UserApiService } from '../../generated'// 引入 userStore
import { userStore } from '@/stores/user'

export async function logout() {
  const user = userStore() // 获取 Pinia 用户 store

  const res = await UserApiService.logoutUsingDelete()
  if (res.data === '200') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // 调用 deleteData 来清空 Pinia store 中的用户信息
    await user.deleteData()
  }

  return res.code
}
