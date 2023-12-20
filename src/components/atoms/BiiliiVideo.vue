<script setup lang="ts">
import TCPlayer from 'tcplayer.js'
import TcplayerBarragePlugin from 'tcplayer-barrage-plugin'
import type { Ref } from 'vue'
import { type Danmu, DanmuApiService, VideoApiService } from '../../../generated'
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

onMounted(async () => {
  const response = await VideoApiService.getVideoUsingGet(Number(props.aid))
  if (response.data?.url != null)
    url.value = response.data?.url
  if (url.value)
    await initializePlayer()
})
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
</script>

<template>
  <video id="player-container-id" class="w-45vw h-30vw" preload="auto" playsinline webkit-playsinline />
  <div class="w-30vw flex">
    <el-input v-model="inputDanmu" class="m-2" placeholder="弹幕" size="large" />
    <el-button class="mt-3" type="primary" round @click="sendDanmu">
      发送弹幕
    </el-button>
  </div>
</template>
