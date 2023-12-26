<script setup lang="ts">
import type { ReplyApi } from 'undraw-ui/dist/components/comment/interface'

// import type { Video } from '@/utils/api'
import type { Ref } from 'vue'
import type { CommentApi, ConfigApi, SubmitParamApi } from 'undraw-ui'
import { UToast, createObjectURL, dayjs } from 'undraw-ui'
import {
  AdvertisementApiService,
  DanmuApiService, FileApiService,
  UserFollowingApiService,
  type UserInfo,
  type Video,
  VideoApiService, type VideoComment,
} from '../../generated'
import { userStore } from '@/stores/user'
import emoji from '@/asset/emoji'
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

const config = reactive<ConfigApi>({
  user: {
    id: 1,
    username: userStore().userInfo.uname,
    avatar: userStore().userInfo.face,
    // 评论id数组 建议:存储方式用户uid和评论id组成关系,根据用户uid来获取对应点赞评论id,然后加入到数组中返回
    likeIds: [1, 2, 3],
  },
  emoji,
  comments: [],
  total: 10,
})

let temp_id = 100
// 提交评论事件
async function submit({ content, parentId, files, finish, reply }: SubmitParamApi) {
  /**
   * 上传文件后端返回图片访问地址，格式以'||'为分割; 如:  '/static/img/program.gif||/static/img/normal.webp'
   */
  const contentImg = files?.map(e => createObjectURL(e)).join('||')

  temp_id += 1
  const comment: CommentApi = {
    id: String(temp_id),
    parentId,
    uid: config.user.id,
    address: '来自昆明',
    content,
    likes: 0,
    createTime: dayjs().subtract(5, 'seconds').toString(),
    contentImg,
    user: {
      username: config.user.username,
      avatar: config.user.avatar,
      level: 5,
      homeLink: `/${(temp_id)}`,
    },
    reply: null,
  }

  const videoComment: Ref<VideoComment> = ref({
    childList: undefined,
    comment: content,
    createTime: undefined,
    id: undefined,
    replyUserId: undefined,
    replyUserInfo: undefined,
    rootId: parentId === null ? undefined : Number(parentId),
    updateTime: undefined,
    userId: undefined,
    userInfo: undefined,
    videoId: Number(aid.value),
  })
  await VideoApiService.addVideoCommentsUsingPost(videoComment.value)

  setTimeout(() => {
    finish(comment)
    UToast({ message: '评论成功!', type: 'info' })
  }, 200)
}
// 点赞按钮事件 将评论id返回后端判断是否点赞，然后在处理点赞状态
function like(id: string, finish: () => void) {
  setTimeout(() => {
    finish()
  }, 200)
}
onMounted(async () => {
  config.comments = []
  const res = await VideoApiService.pageListVideoCommentsUsingGet(1, 1000, Number(aid.value))
  const rootList: Array<VideoComment> | undefined = res.data?.list
  for (const item of rootList) {
    const replyApi: Ref<ReplyApi> = ref({
      total: 0,
      list: [],
    })
    const temp: Ref<CommentApi> = ref({
      id: item.id,
      parentId: item.rootId,
      uid: item.userId,
      address: '来自昆明',
      content: item.comment,
      likes: 3,
      contentImg: undefined,
      createTime: item.createTime,
      user: {
        username: item.userInfo?.nick,
        avatar: item.userInfo?.avatar,
        level: 5,
        homeLink: '/1',
      },
      reply: replyApi.value,
    })
    if (item.childList !== undefined) {
      for (const item1 of item.childList) {
        const temp1: Ref<CommentApi> = ref({
          id: item1.id,
          parentId: item1.rootId,
          uid: item1.userId,
          address: '来自昆明',
          content: item1.comment,
          likes: 3,
          contentImg: undefined,
          createTime: item1.createTime,
          user: {
            username: item1.userInfo?.nick,
            avatar: item1.userInfo?.avatar,
            level: 5,
            homeLink: '/1',
          },
          reply: null,
        })
        temp.value.reply?.list.push(temp1.value)
      }
    }
    config.comments.push(temp.value)
  }
})
const isHaveAd = ref(false)
const adInfo = ref({
  aid: 0,
  advertisementPath: '',
  imgSrc: '',
})
onMounted(async () => {
  const res = await AdvertisementApiService.getAdvertisementUsingGet(Number(aid.value))
  if(res.data !== undefined && res.data.id !== undefined){
    await AdvertisementApiService.impressionsAdvertisementUsingPost(res.data.id)
    adInfo.value.aid = res.data.id
    if (res.data.advertisementPath != null) {
      adInfo.value.advertisementPath = res.data.advertisementPath
    }
    const res1 = await FileApiService.getFileAdvertisementUsingGet(res.data?.contentId)
    adInfo.value.imgSrc = res1.data?.url as string
    isHaveAd.value = true;
  }
})
function toAd (){
  AdvertisementApiService.clickAdvertisementUsingPost(adInfo.value.aid)
  const l = 'https://' + adInfo.value.advertisementPath
  window.open(l, '_blank');
}
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
  </div>
  <div v-if="isHaveAd">
    <img class="ml-20 h-200px w-50vw" @click="toAd" :src="adInfo.imgSrc">
  </div>
  <u-comment class="ml-0 w-50vw" :config="config" relative-time @submit="submit" @like="like" />
</template>
