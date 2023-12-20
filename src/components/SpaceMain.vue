<script setup lang="ts">
import type { Ref } from 'vue'
import { UserApiService, type UserInfo, type Video, VideoApiService } from '../../generated'

const route = useRoute()
const mid = computed(() => Number.parseInt(`${route.params.mid}`))
const userInfo: Ref<UserInfo> = ref({})
const videos: Ref<Video[]> = ref([])

onMounted(async () => {
  const res1 = await UserApiService.getUserInfoByUserIdUsingGet(mid.value)
  if (res1.data !== undefined)
    userInfo.value = res1.data
  const res2 = await VideoApiService.getVideosByUserIdUsingGet(mid.value)
  if (res2.data !== undefined)
    videos.value = res2.data
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-end w-full h-40 p4 max-w-300">
      <ElImage class="border-gray-400 border-solid rounded-full w-30 h-30 border-3 shrink-0" :src="userInfo?.avatar" referrerpolicy="no-referrer" />
      <div class="flex flex-col ml4">
        <span class="text-xl">{{ userInfo?.nick }}</span>
        <span class="text-lg text-gray-600 opacity-40 line-clamp-1">{{ userInfo?.sign }}</span>
      </div>
    </div>
    <Divider class="w-full max-w-300" />
    <!-- Cannot get user video from space because anti-crawler so use Rcmd Video replace it -->
    <VideosBoard class="h-90vh max-w-300" :videos="videos" />
  </div>
</template>
