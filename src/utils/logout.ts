import { OpenAPI, UserApiService } from '../../generated'

export async function logout() {
  const res = await UserApiService.logoutUsingDelete()
  if (res.data === '200')
    OpenAPI.TOKEN = undefined
  return res.code
}

// export async function logout() {
//   const cookies = useCookies()
//   const res = await fetch(API.logout(), {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: `biliCSRF=${cookies.get('bili_jct')}`,
//   }).then(res => res.json())
//
//   return res
// }
