<script setup lang="ts">
const props = defineProps<{
  callback?: (ref?: Ref | HTMLElement) => void
}>()

const { userInfo } = storeToRefs(userStore())
const router = useRouter()

const progress = computed(() => {
  const { next_exp, current_exp } = userInfo.value.level_info

  if (typeof next_exp === 'string')
    return 1
  else
    return current_exp / (current_exp + next_exp)
})

function routeGoWithClose(path: string) {
  router.push(path)

  if (props.callback)
    props.callback()
}
const handleLogout = async () => {
  await logout();
  await router.push('/logout'); // 假设登录页面的路由是 '/login'
};
</script>

<template>
  <div class="flex flex-col bg-white border-gray-100 border-solid rounded-md border-1 w-60 p4">
    <span class="font-sans text-2xl">{{ userInfo.uname }}</span>
    <span class="font-sans text-sm text-gray-400">mid: {{ userInfo.mid }}</span>
    <Divider class="my-4" />
    <div class="grid grid-cols-3 gap-4 text-center">
      <UserInfoBox title="关注" :data="userInfo.following" />
      <UserInfoBox title="粉丝" :data="userInfo.follower" />
      <UserInfoBox title="动态" :data="userInfo.dynamic_count" />
      <UserInfoBox title="硬币" :data="userInfo.money" />
    </div>
    <div class="flex items-center justify-around mt-4 select-none">
      <span>LV{{ userInfo.level_info.current_level }}</span>
      <Progress class="w-full mx-2" :num="progress" />
      <span>LV{{ userInfo.level_info.current_level + 1 }}</span>
    </div>
    <Divider class="my-4" />
    <div class="flex flex-row items-center justify-start text-black rounded-md p2 cursor-pointer hover:(bg-light bg-opacity-70) active:(bg-light bg-opacity-70)" @click="routeGoWithClose('/managePlatform')">
      <div class="w-5 h-5 i-lucide:log-out" />
      <span class="float-right ml-2">平台管理</span>
    </div>
    <div class="flex flex-row items-center justify-start text-black rounded-md p2 cursor-pointer hover:(bg-light bg-opacity-70) active:(bg-light bg-opacity-70)" @click="routeGoWithClose('/uploadVideo')">
      <div class="w-5 h-5 i-lucide:log-out" />
      <span class="float-right ml-2">上传视频</span>
    </div>
    <div class="flex flex-row items-center justify-start text-black rounded-md p2 cursor-pointer hover:(bg-light bg-opacity-70) active:(bg-light bg-opacity-70)" @click="routeGoWithClose('/editUserInfo')">
      <div class="w-5 h-5 i-lucide:log-out" />
      <span class="float-right ml-2">个人中心</span>
    </div>
    <div class="flex flex-row items-center justify-start text-black rounded-md p2 cursor-pointer hover:(bg-light bg-opacity-70) active:(bg-light bg-opacity-70)" @click="handleLogout">
      <div class="w-5 h-5 i-lucide:log-out" />
      <span class="float-right ml-2">退出</span>
    </div>


  </div>
</template>
