<script setup lang="ts">
import type { Ref } from 'vue'
import {
  AdvertisementApiService,
  FileApiService,
  type TAdvertisement,
  type Video,
  VideoApiService
} from '../../generated'

const page = ref(1)
const pageSize = ref(8)
const videos: Ref<Video[]> = ref([])
const total = ref(0)

async function loadPage(newPage: number) {
  page.value = newPage
  const res = await VideoApiService.pageListVideosUsingGet('0', page.value, pageSize.value)
  if (res.data?.total)
    total.value = res.data.total
  if (res.data?.list) {
    videos.value = [] // 清空 videos 数组
    for (const video of res.data.list)
      videos.value.push(video)
  }
}

onMounted(() => loadPage(page.value))
const list: Ref<any[]> = ref([])
onMounted(async () => {
  const res1 = await AdvertisementApiService.getAdvertisementUsingGet(-1);
  if (res1.data?.id !== undefined)
    await AdvertisementApiService.impressionsAdvertisementUsingPost(res1.data.id)
  const res11 = await FileApiService.getFileAdvertisementUsingGet(res1.data?.contentId)

  const res2 = await AdvertisementApiService.getAdvertisementUsingGet(-2);
  if (res2.data?.id !== undefined)
    await AdvertisementApiService.impressionsAdvertisementUsingPost(res2.data.id)
  const res21 = await FileApiService.getFileAdvertisementUsingGet(res2.data?.contentId)

  const res3 = await AdvertisementApiService.getAdvertisementUsingGet(-3);
  if (res3.data?.id !== undefined)
    await AdvertisementApiService.impressionsAdvertisementUsingPost(res3.data.id)
  const res31 = await FileApiService.getFileAdvertisementUsingGet(res3.data?.contentId)

  const res4 = await AdvertisementApiService.getAdvertisementUsingGet(-4);
  if (res4.data?.id !== undefined)
    await AdvertisementApiService.impressionsAdvertisementUsingPost(res4.data.id)
  const res41 = await FileApiService.getFileAdvertisementUsingGet(res4.data?.contentId)

  if(res1.data?.id !== undefined && res11.data?.url !== undefined){
    list.value.push({
      aid: res1.data?.id,
      advertisementPath: res1.data.advertisementPath,
      imgSrc: res11.data?.url,
    })
  }
  if(res2.data?.id !== undefined && res21.data?.url !== undefined){
    list.value.push({
      aid: res2.data?.id,
      advertisementPath: res2.data.advertisementPath,
      imgSrc: res21.data?.url,
    })
  }
  if(res3.data?.id !== undefined && res31.data?.url !== undefined){
    list.value.push({
      aid: res3.data?.id,
      advertisementPath: res3.data.advertisementPath,
      imgSrc: res31.data?.url,
    })
  }
  if(res4.data?.id !== undefined && res41.data?.url !== undefined){
    list.value.push({
      aid: res4.data?.id,
      advertisementPath: res4.data.advertisementPath,
      imgSrc: res41.data?.url,
    })
  }
})
function toAd (url: string){
  const l = 'https://' + url
  window.open(l, '_blank');
}
</script>

<template>
  <div class="block text-center">
    <el-carousel height="200px">
      <el-carousel-item v-for="item in list" :key="item">
        <img :src="item.imgSrc" @click="toAd(item.advertisementPath)" />
      </el-carousel-item>
    </el-carousel>
  </div>
  <VideosBoard :videos="videos" :total-videos="total" />
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="8"
    @current-change="loadPage"
  />
</template>
