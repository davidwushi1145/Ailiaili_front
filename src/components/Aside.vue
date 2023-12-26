<script setup lang="ts">
import { type FollowingGroup, UserFollowingApiService } from '../../generated'
import type { Follow } from '@/utils/getFollows'
import { ASIDE_MENU } from '@/stores/state'

withDefaults(
  defineProps<{
    unvariable?: boolean
  }>(),
  {
    unvariable: false,
  },
)
const { userInfo } = storeToRefs(userStore())
// const { activeAsideCollapseName } = storeToRefs(navStore())
const mid = computed(() => String(userInfo.value.mid))
const follows: Follow[] = reactive([])
const activeAsideCollapseName = ref(true)

// const { data: follows, loadmore, canLoadmore } = useDataLoadmore<Follow>(getFollows, false, mid)

onMounted(async () => {
  const response = await UserFollowingApiService.getUserFollowingsUsingGet()
  let target: FollowingGroup | undefined
  if (response.data !== undefined) {
    activeAsideCollapseName.value = true
    target = response.data.find(item => item.id === -1)
    const userList = target ? target.followingUserInfoList : []
    if (userList !== undefined) {
      userList.forEach((user) => {
        // 创建一个新的Follow对象，并将其添加到follows数组中
        const newFollow: Follow = {
          mid: user.id as number,
          attribute: 0,
          special: 0,
          uname: user.nick as string,
          face: user.avatar as string,
        }
        follows.push(newFollow)
      })
    }
  }
})
</script>

<template>
  <ElScrollbar class="bg-white w-25 lg:w-60" :class="[{ 'w-60!': unvariable }]">
    <template v-for="(item, index) in ASIDE_MENU" :key="index">
      <AsideButton :to="item.to" :icon="item.icon" :title="item.title" :unvariable="unvariable" />
    </template>
    <Divider class="mx2" />
    <ElCollapse v-model="activeAsideCollapseName" class="bg-slate-200 my-collapse">
      <ElCollapseItem v-if="follows.length > 0" name="1" class="bg-slate-200!">
        <template #title>
          <span
            class="w-3/4 overflow-hidden text-sm text-center lg:(text-lg text-left pl4) text-nowrap text-ellipsis select-none"
            :class="[{ 'text-lg! text-left! pl4!': unvariable }]"
          >关注列表</Span>
        </template>
        <AsideButton v-for="follow in follows" :key="follow.mid" :to="`/space/${follow.mid}`" :title="follow.uname" :icon="follow.face" :unvariable="unvariable" />
        <!--        <div v-show="canLoadmore && follows.length" class="flex justify-center w-full" @click="loadmore"> -->
        <!--          <span class="text-orange-400 cursor-pointer select-none">Show More</span> -->
        <!--        </div> -->
      </ElCollapseItem>
    </ElCollapse>
    <div class="h-20" />
  </ElScrollbar>
</template>
