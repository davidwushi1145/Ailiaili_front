<script setup lang="ts">
import { DanmuApiService, type Video, VideoApiService } from '../../../generated'

const props = defineProps<{
  video: Video | undefined
}>()

const views = ref(0)
const danmaku = ref(0)
const cover = computed(() => (props.video as Video).thumbnail)
// const view = computed(() => (formatNumber((props.video as Video).stat.view))
onMounted(async () => {
  const res1 = await VideoApiService.getVideoViewCountsUsingGet(Number(props.video?.id))
  if (res1.data != null)
    views.value = res1.data
  const res2 = await DanmuApiService.getDanmusUsingGet(Number(props.video?.id))
  if (res2.data !== undefined)
    danmaku.value = res2.data?.length as number
})
</script>

<template>
  <div class="box-border w-full border-gray-300 border-solid rounded-md cursor-pointer mt2 border-1 group">
    <RouterLink :to="`/watch?aid=${video?.id}`">
      <div class="flex">
        <ElImage referrerpolicy="no-referrer" class="max-h-30 min-w-55 rounded-l-md aspect-video" :src="cover" loading="lazy" fit="cover" />
        <div class="relative flex flex-col justify-start w-full h-30 ml2">
          <span class="text-base break-all text-wrap line-clamp-2 group-hover:(text-blue)">{{ video?.title }}</span>
          <span class="text-sm text-gray-600 break-all text-wrap line-clamp-2 opacity-40 mt2">{{ video?.description }}</span>
          <div class="absolute bottom-0 left-0 flex">
            <div class="flex items-center text-gray-600 opacity-40">
              <ViewsIcon class="w-5 h-5" />
              <span class="ml2">{{ views }}</span>
            </div>
            <div class="flex items-center text-gray-600 opacity-40 ml4">
              <DanmukuIcon class="w-5 h-5" />
              <span class="ml2">{{ danmaku }}</span>
            </div>
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
