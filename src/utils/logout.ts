import { UserApiService } from '../../generated'

export async function logout() {
  const res = await UserApiService.logoutUsingDelete()
  if (res.data === '200') {
    await localStorage.removeItem('token')
    await localStorage.removeItem('user')
  }
  return res.code
}
