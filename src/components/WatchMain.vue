<script setup lang="ts">
// import type { Video } from '@/utils/api'
import type { Ref } from 'vue'
import {
  DanmuApiService,
  UserFollowingApiService,
  type UserInfo,
  type Video,
  VideoApiService,
} from '../../generated'
import type { Reply } from '@/utils/getReply'

const route = useRoute()

const aid = computed(() => String(route.query.aid))
const videoInfo: Ref<Video> = ref({})
const userInfo: Ref<UserInfo> = ref({})
const views = ref(0)
const danmaku = ref(0)
const { data: replies, loadmore, isLoading } = useDataLoadmore<Reply>(getReply, false, aid)
const videoOwnerID = computed(() => userInfo.value.id)
const relatedVideos: Ref<Video[]> = ref([])
const follower = ref(0)

onMounted(async () => {
  const res1 = await VideoApiService.getVideoDetailsUsingGet(Number(aid.value))
  videoInfo.value = res1.data.video
  userInfo.value = res1.data.userInfo
  const res2 = await UserFollowingApiService.getFansUsingGet1(userInfo.value.userId)
  if (res2.data !== undefined)
    follower.value = res2.data.length
  VideoApiService.addVideoViewUsingPost({
    id: undefined,
    videoId: videoInfo.value.id,
    userId: userInfo.value.id,
    clientId: undefined,
    ip: undefined,
    createTime: undefined,
  })
})
onMounted(async () => {
  const res1 = await VideoApiService.getVideoViewCountsUsingGet(Number(aid.value))
  if (res1.data != null)
    views.value = res1.data
  const res2 = await DanmuApiService.getDanmusUsingGet(Number(aid.value))
  if (res2.data !== undefined)
    danmaku.value = res2.data?.length as number
})
onMounted(async () => {
  const res = await VideoApiService.recommendUsingGet()
  if (res.data !== undefined)
    relatedVideos.value = res.data
})

useInfiniteScroll(
  window,
  loadmore,
  {
    distance: 300,
  },
)
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col w-full xl:(flex-row) max-w-400 ">
      <div class="w-full xl:(w-5/7)">
        <h1 class="font-400 my3">
          {{ videoInfo?.title }}
        </h1>
        <div class="flex flex-row my2">
          <div class="flex items-center text-gray-600 opacity-40">
            <ViewsIcon class="w-5 h-5" />
            <span class="ml2">{{ views }}</span>
          </div>
          <div class="flex items-center text-gray-600 opacity-40 ml4">
            <DanmukuIcon class="w-5 h-5" />
            <span class="ml2">{{ danmaku }}</span>
          </div>
        </div>
        <div class="w-full aspect-video">
          <BiiliiVideo :aid="aid" />
        </div>
        <div class="flex w-full my2">
          <RouterLink :to="`/space/${videoOwnerID}`">
            <ElImage
              class="w-12 h-12 rounded-full hover:(cursor-pointer)" :src="userInfo.avatar"
              referrerpolicy="no-referrer"
            />
          </RouterLink>
          <div class="flex flex-col ml4">
            <RouterLink :to="`/space/${videoOwnerID}`">
              <span class="text-lg hover:(cursor-pointer)">{{ userInfo.nick }}</span>
            </RouterLink>
            <span class="text-sm text-gray-600 opacity-40">{{ follower }} 关注数</span>
          </div>
        </div>
        <div class="w-full my2">
          <TextFeild class="text-gray-600 opacity-40">
            {{ videoInfo.description }}
          </TextFeild>
        </div>
      </div>
      <ElScrollbar class="xl:(w-2/7 ml2 h-200!) h-70! overflow-hidden">
        <VideoMidCard v-for="video in relatedVideos" :key="video.id" class="border-0" :video="video" />
        <div class="h-5 SpaceHolder" />
      </ElScrollbar>
    </div>
    <Divider class="hidden xl:(w-full max-w-400 flex)" />
    <div v-infinite-scroll="loadmore" :infinite-scroll-immediate="false" class="w-full mt4 xl:max-w-400">
      <Comments v-for="(reply, index) in replies" :key="index" class="mt4" :reply="reply" />
      <div v-show="isLoading" class="w-full text-center">
        <span class="text-xl text-orange-400 animate-flash animate-count-infinte">Loading...</span>
      </div>
    </div>
  </div>
</template>
