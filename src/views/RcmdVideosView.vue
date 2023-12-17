<script setup lang="ts">
import type { Ref } from 'vue'
import { type Video, VideoApiService } from '../../generated'

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
</script>

<template>
  <VideosBoard :videos="videos" :total-videos="total" />
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="8"
    @current-change="loadPage"
  />
</template>
