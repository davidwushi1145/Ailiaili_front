<script setup lang="ts">
import type { Ref } from 'vue'
import { type UserInfo, VideoApiService } from '../../../generated'

const props = defineProps<{
  id: number
  view: number
  pubdate: number
  pic: string
  title: string
  ownerName: string
  ownerId: number
  ownerFace?: string
  date?: string
}>()

const views = ref(0)
onMounted(async () => {
  const res = await VideoApiService.getVideoViewCountsUsingGet(props.id)
  if (res.data != null)
    views.value = res.data
})
const userInfo: Ref<UserInfo> = ref({})
onMounted(async () => {
  // 如果还没有获取到这个用户的信息，就发送一个请求来获取
  const res = await VideoApiService.getVideoDetailsUsingGet(props.id)
  userInfo.value = res.data.userInfo
})
</script>

<template>
  <div class="flex flex-col items-start justify-start cursor-pointer m4">
    <RouterLink :to="`/watch?aid=${id}`">
      <ElImage :src="pic" class="object-cover min-w-full transition-all duration-75 aspect-video rounded-xl hover:rounded-none" loading="lazy" referrerpolicy="no-referrer" />
    </RouterLink>
    <div class="flex flex-row justify-start w-full py2">
      <RouterLink v-if="userInfo.avatar" :to="`/space/${userInfo.id}`">
        <ElImage :src="userInfo.avatar" class="w-10 h-10 border-gray-200 border-solid rounded-full shrink-0 border-1" loading="lazy" referrerpolicy="no-referrer" />
      </RouterLink>
      <div class="flex flex-col justify-start w-full pl2">
        <RouterLink :to="`/watch?aid=${id}`">
          <span class="text-md line-clamp-2 hover:(text-blue) transition-all duration-75" v-html="title " />
        </RouterLink>
        <span class="text-xs text-black text-gray-700 mb1 mt2">{{ userInfo.nick }}</span>
        <div class="text-xs text-black text-gray-700">
          <span>{{ views }} 观看数 </span>
          <span>• {{ date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
