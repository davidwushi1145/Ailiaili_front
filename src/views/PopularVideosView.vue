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
  videos.value.sort((a, b) => {
    const scoreA = (a.collections || 0) * 0.3 + (a.likes || 0) * 0.2 + (a.coins || 0) * 0.2 + (a.views || 0) * 0.3
    const scoreB = (b.collections || 0) * 0.3 + (b.likes || 0) * 0.2 + (b.coins || 0) * 0.2 + (b.views || 0) * 0.3

    return scoreB - scoreA // 降序排序
  })
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
