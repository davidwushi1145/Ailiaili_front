<script setup lang="ts">
import TCPlayer from 'tcplayer.js'
import TcplayerBarragePlugin from 'tcplayer-barrage-plugin'
import type { Ref } from 'vue'
import { type Danmu, DanmuApiService, VideoApiService, type VideoCoin, type VideoCollection } from '../../../generated'
import 'tcplayer.js/dist/tcplayer.min.css'

const props = defineProps<{
  aid: string
}>()
interface TimeLineItem {
  mode: number
  text: string | undefined
  stime: number
  size: number
  color: string
}
let player
let tcplayerBarrage
const url: Ref<string> = ref('')
const inputDanmu = ref('')
async function initializePlayer() {
  player = TCPlayer('player-container-id', {
    multiResolution: {
      // 配置多个清晰度地址
      sources: {
        LC: [{
          src: url?.value.replace('/bilibili/', '/bilibili/流畅/'),
        }],
        SD: [{
          src: url?.value.replace('/bilibili/', '/bilibili/标清/'),
        }],
        HD: [{
          src: url?.value.replace('/bilibili/', '/bilibili/高清/'),
        }],
        FHD: [{
          src: url?.value.replace('/bilibili/', '/bilibili/超清/'),
        }],
      },
      // 配置每个清晰度标签
      labels: {
        LC: '流畅',
        SD: '标清',
        HD: '高清',
        FHD: '超清',
      },
      // 配置各清晰度在播放器组件上的顺序
      showOrder: ['LC', 'SD', 'HD', 'FHD'],
      // 配置默认选中的清晰度
      defaultRes: 'SD',
    },
    autoplay: true,
    licenseUrl: 'https://',
  })
  tcplayerBarrage = new TcplayerBarragePlugin(player)
  tcplayerBarrage.init()

  const danmus: Ref<Danmu[]> = ref([])
  const res = await DanmuApiService.getDanmusUsingGet(Number(props.aid), undefined, undefined)
  if (res.data !== undefined)
    danmus.value = res.data
  // 加载弹幕列表，配合后端通过接口加载
  const timeLine = ref<TimeLineItem[]>([])
  for (const item of danmus.value) {
    const danmu = {
      mode: 1,
      text: item.content,
      stime: item.danmuTime,
      size: 25,
      color: '#FFFFFF',
    }
    timeLine.value.push(danmu)
  }
  tcplayerBarrage.load(timeLine.value)
  tcplayerBarrage.start()
}

async function sendDanmu() {
  if (inputDanmu.value === '')
    return
  const danmu: Ref<Danmu> = ref({
    content: inputDanmu.value,
    createTime: undefined,
    danmuTime: player.currentTime() * 1000,
    id: undefined,
    userId: undefined,
    videoId: Number(props.aid),
  })
  const barrage = ref({
    mode: 1,
    text: inputDanmu.value,
    size: 30,
    color: '#ff0000',
  })
  // 即时发送弹幕
  tcplayerBarrage.send(barrage.value)
  inputDanmu.value = ''
  await DanmuApiService.addDanmuUsingPost(danmu.value)
}

onMounted(async () => {
  const response = await VideoApiService.getVideoUsingGet(Number(props.aid))
  if (response.data?.url != null)
    url.value = response.data?.url
  if (url.value)
    await initializePlayer()
})

const likeCount = ref()
const isLike = ref(false)
const collectionCount = ref()
const isCollection = ref(false)
const coinsCount = ref()
const isCoins = ref(false)
const showForm = ref(false)

onMounted(async () => {
  const res1 = await VideoApiService.getVideoLikesUsingGet(Number(props.aid))
  likeCount.value = res1.data.count
  isLike.value = res1.data.like

  const res2 = await VideoApiService.getVideoCollectionsUsingGet(Number(props.aid))
  collectionCount.value = res2.data.count
  isCollection.value = res2.data.collected

  const res3 = await VideoApiService.getVideoCoinsUsingGet(Number(props.aid))
  coinsCount.value = res3.data.count
  isCoins.value = res3.data.given
})
async function like() {
  if (isLike.value)
    await VideoApiService.deleteVideoLikesUsingDelete(Number(props.aid))
  else
    await VideoApiService.addVideoLikeUsingPost(Number(props.aid))

  const res1 = await VideoApiService.getVideoLikesUsingGet(Number(props.aid))
  likeCount.value = res1.data.count
  isLike.value = res1.data.like
}
async function collection() {
  if (isCollection.value) {
    await VideoApiService.deleteVideoCollectionUsingDelete(Number(props.aid))
  }
  else {
    const videoCollection: Ref<VideoCollection> = ref({
      createTime: undefined,
      groupId: 1,
      id: undefined,
      userId: undefined,
      videoId: Number(props.aid),
    })
    await VideoApiService.addVideoCollectionUsingPost(videoCollection.value)
  }

  const res2 = await VideoApiService.getVideoCollectionsUsingGet(Number(props.aid))
  collectionCount.value = res2.data.count
  isCollection.value = res2.data.collected
}
function showCoin() {
  showForm.value = true
}
const allimgData = [
  {
    id: '001',
    imgsrc: 'https://try2b1st-photo-1311984591.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-12-23%20174443.png',
  },
  {
    id: '002',
    imgsrc: 'https://try2b1st-photo-1311984591.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-12-23%20174503.png',
  },
]
const selectedImgIndex = ref(0)
function checkImg(index: any) {
  selectedImgIndex.value = index // 设置选中的图片
}
function onCancel() {
  showForm.value = false
}

async function onSubmit() {
  const videoCoin: Ref<VideoCoin> = ref({
    amount: selectedImgIndex.value + 1,
    createTime: undefined,
    id: undefined,
    updateTime: undefined,
    userId: undefined,
    videoId: Number(props.aid),
  })
  await VideoApiService.addVideoCoinsUsingPost(videoCoin.value)
  showForm.value = false

  const res3 = await VideoApiService.getVideoCoinsUsingGet(Number(props.aid))
  coinsCount.value = res3.data.count
  isCoins.value = res3.data.given
}
</script>

<template>
  <video id="player-container-id" class="w-45vw h-30vw" preload="auto" playsinline webkit-playsinline />
  <div class="flex">
    <div @click="like">
      <svg :style="{ fill: isLike ? 'blue' : 'black' }" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" class="video-like-icon video-toolbar-item-icon"><path d="M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853 17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402 33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 25.7957C30.2558 28.7683 27.5894 30.8573 24.528 30.8573H11.9911H11.9902Z" /></svg>
      <div class="text-center">
        {{ likeCount !== 0 ? likeCount : 0 }}
      </div>
    </div>
    <div class="ml-3" @click="showCoin">
      <svg v-if="!isCoins" width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" data-v-3b3ce5ad=""><path fill-rule="evenodd" clip-rule="evenodd" d="M14.045 25.5454C7.69377 25.5454 2.54504 20.3967 2.54504 14.0454C2.54504 7.69413 7.69377 2.54541 14.045 2.54541C20.3963 2.54541 25.545 7.69413 25.545 14.0454C25.545 17.0954 24.3334 20.0205 22.1768 22.1771C20.0201 24.3338 17.095 25.5454 14.045 25.5454ZM9.66202 6.81624H18.2761C18.825 6.81624 19.27 7.22183 19.27 7.72216C19.27 8.22248 18.825 8.62807 18.2761 8.62807H14.95V10.2903C17.989 10.4444 20.3766 12.9487 20.3855 15.9916V17.1995C20.3854 17.6997 19.9799 18.1052 19.4796 18.1052C18.9793 18.1052 18.5738 17.6997 18.5737 17.1995V15.9916C18.5667 13.9478 16.9882 12.2535 14.95 12.1022V20.5574C14.95 21.0577 14.5444 21.4633 14.0441 21.4633C13.5437 21.4633 13.1382 21.0577 13.1382 20.5574V12.1022C11.1 12.2535 9.52148 13.9478 9.51448 15.9916V17.1995C9.5144 17.6997 9.10883 18.1052 8.60856 18.1052C8.1083 18.1052 7.70273 17.6997 7.70265 17.1995V15.9916C7.71158 12.9487 10.0992 10.4444 13.1382 10.2903V8.62807H9.66202C9.11309 8.62807 8.66809 8.22248 8.66809 7.72216C8.66809 7.22183 9.11309 6.81624 9.66202 6.81624Z" fill="currentColor" /></svg>
      <svg v-else width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" data-v-3b3ce5ad=""><path fill-rule="evenodd" clip-rule="evenodd" d="M14.045 25.5454C7.69377 25.5454 2.54504 20.3967 2.54504 14.0454C2.54504 7.69413 7.69377 2.54541 14.045 2.54541C20.3963 2.54541 25.545 7.69413 25.545 14.0454C25.545 17.0954 24.3334 20.0205 22.1768 22.1771C20.0201 24.3338 17.095 25.5454 14.045 25.5454ZM9.66202 6.81624H18.2761C18.825 6.81624 19.27 7.22183 19.27 7.72216C19.27 8.22248 18.825 8.62807 18.2761 8.62807H14.95V10.2903C17.989 10.4444 20.3766 12.9487 20.3855 15.9916V17.1995C20.3854 17.6997 19.9799 18.1052 19.4796 18.1052C18.9793 18.1052 18.5738 17.6997 18.5737 17.1995V15.9916C18.5667 13.9478 16.9882 12.2535 14.95 12.1022V20.5574C14.95 21.0577 14.5444 21.4633 14.0441 21.4633C13.5437 21.4633 13.1382 21.0577 13.1382 20.5574V12.1022C11.1 12.2535 9.52148 13.9478 9.51448 15.9916V17.1995C9.5144 17.6997 9.10883 18.1052 8.60856 18.1052C8.1083 18.1052 7.70273 17.6997 7.70265 17.1995V15.9916C7.71158 12.9487 10.0992 10.4444 13.1382 10.2903V8.62807H9.66202C9.11309 8.62807 8.66809 8.22248 8.66809 7.72216C8.66809 7.22183 9.11309 6.81624 9.66202 6.81624Z" fill="blue" /></svg>
      <div class="text-center">
        {{ coinsCount !== 0 ? coinsCount : 0 }}
      </div>
    </div>
    <div class="ml-3" @click="collection">
      <svg v-if="!isCollection" width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" data-v-c9ebd4c8=""><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="currentColor" /></svg>
      <svg v-else width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" data-v-c9ebd4c8=""><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="blue" /></svg>
      <div class="text-center">
        {{ collectionCount !== 0 ? collectionCount : 0 }}
      </div>
    </div>
  </div>
  <div class="w-50vh flex">
    <el-input v-model="inputDanmu" class="m-2" placeholder="弹幕" size="large" />
    <el-button class="mt-3" type="primary" round @click="sendDanmu">
      发送弹幕
    </el-button>
  </div>

  <el-form v-if="showForm" label-width="120px" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg max-w-md mx-auto">
      <div class="text-lg text-black ml-55">
        投币
      </div>
      <el-form-item class="mr-25">
        <div v-for="(item, index) in allimgData" :key="index" @click="checkImg(index)">
          <img class="w-24 h-36 ml-3" :class="{ 'border-5 border-solid border-pink-500': index === selectedImgIndex }" :src="item.imgsrc" alt="">
        </div>
      </el-form-item>
      <el-form-item class="ml-13">
        <el-button type="primary" @click="onSubmit">
          投币
        </el-button>
        <el-button @click="onCancel">
          取消
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
