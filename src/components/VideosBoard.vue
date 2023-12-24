<script setup lang="ts">
import { type Video } from '../../generated'

const props = defineProps<{
  // callback: (newPage: number) => void
  videos: Video[]
}>()
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb16"
  >
    <VideoCard
      v-for="video in videos" :id="video.id as number"
      :key="video.id as number" :view="video.id as number" :pubdate="video.id as number"
      :pic="video.thumbnail as string" :owner-face="video.userInfo?.avatar" :owner-name="video.userInfo?.nick as string"
      :owner-id="video.userId as number" :title="video.title as string" :date="video.createTime"
    />
  </div>
</template>
