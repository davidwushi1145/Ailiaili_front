<script setup lang="ts">
import type { Reply } from '@/utils/getReply'

const props = defineProps<{
  reply: Reply
}>()

const route = useRoute()

const replies = ref<Reply[]>(props.reply.replies)

const showPagination = ref(false)
const showLoadMore = ref(true)
const totalComments = ref(0)
const isLoading = ref(false)

function loadmore(idx: number) {
  async function getData() {
    isLoading.value = true
    const res = await getReplyReply(idx, String(route.query.aid), String(props.reply.rpid))
    if (res.data.replies?.length >= 5) {
      showPagination.value = true
      totalComments.value = res.data.page.count
    }
    else {
      showLoadMore.value = false
    }

    replies.value = res.data.replies
    isLoading.value = false
  }

  getData()
}
</script>

<template>
  <Comment :uname="reply.member.uname" :message="reply.content.message" :avatar="reply.member.avatar">
    <Comment v-for="(item, index) in replies" :key="index" class="my4" :uname="item.member.uname" :message="item.content.message" :avatar="item.member.avatar" />
    <div v-if="reply.reply_control.sub_reply_entry_text && reply.reply_control.sub_reply_entry_text.match(/\d+/)?.map(Number)[0]! > 3" class="w-full">
      <span
        v-show="!showPagination && showLoadMore"
        class="float-left text-sm text-orange-400 cursor-pointer select-none"
        :class="[{ 'animate-flash animate-count-infinte': isLoading }]"
        @click="loadmore(1)"
      >{{ isLoading ? 'Loading...' : `${reply.reply_control.sub_reply_entry_text}，点击查看` }}</span>
      <el-pagination v-show="showPagination" layout="prev, pager, next" :total="totalComments" :default-page-size="10" @current-change="loadmore" />
    </div>
  </Comment>
</template>
