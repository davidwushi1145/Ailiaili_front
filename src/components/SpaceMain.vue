<script setup lang="ts">
import router from "@/router";
import * as path from "path";
import type { Ref } from 'vue'
import {
  UserApiService,
  type UserFollowing,
  UserFollowingApiService,
  type UserInfo,
  type Video,
  VideoApiService,
} from '../../generated'

const route = useRoute()
const mid = computed(() => Number.parseInt(`${route.params.mid}`))
const userInfo: Ref<UserInfo> = ref({})
const videos: Ref<Video[]> = ref([])
const isFollow = ref(false)

onMounted(async () => {
  const res1 = await UserApiService.getUserInfoByUserIdUsingGet(mid.value)
  if (res1.data !== undefined)
    userInfo.value = res1.data
  const res2 = await VideoApiService.getVideosByUserIdUsingGet(mid.value)
  if (res2.data !== undefined)
    videos.value = res2.data
  const res3 = await UserFollowingApiService.getIsFollowUsingGet(mid.value)
  if (res3.data !== undefined)
    isFollow.value = res3.data
})
async function addFollow() {
  if (isFollow.value) {
    await UserFollowingApiService.deleteFollowingUsingDelete(mid.value)
  }
  else {
    const userFollowing: Ref<UserFollowing> = ref({
      createTime: undefined,
      followingId: mid,
      groupId: undefined,
      id: undefined,
      updateTime: undefined,
      userId: undefined,
      userInfo: undefined,
    })
    await UserFollowingApiService.addUserFollowingsUsingPost(userFollowing.value)
  }

  const res3 = await UserFollowingApiService.getIsFollowUsingGet(mid.value)
  if (res3.data !== undefined)
    isFollow.value = res3.data
}
function toSend() {
  router.push({path: `/chat/${userInfo.value.id}`})
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-end w-full h-40 p4 max-w-300">
      <ElImage class="border-gray-400 border-solid rounded-full w-30 h-30 border-3 shrink-0" :src="userInfo?.avatar" referrerpolicy="no-referrer" />
      <div class="flex flex-col ml4">
        <span class="text-xl">{{ userInfo?.nick }}</span>
        <span class="text-lg text-gray-600 opacity-40 line-clamp-1">{{ userInfo?.sign }}</span>
      </div>
      <el-button type="primary" class="ml-4" @click="toSend">发送消息</el-button>
      <div class="ml-7" @click="addFollow">
        <img v-if="isFollow" src="../asset/已关注.png" alt="">
        <img v-else src="../asset/关注.png" alt="">
      </div>
    </div>
    <Divider class="w-full max-w-300" />
    <VideosBoard class="h-90vh max-w-300" :videos="videos" />
  </div>
</template>
