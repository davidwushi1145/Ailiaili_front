<script setup lang="ts">

import type {Ref} from "vue";
import {AdvertisementApiService, type TMessages, UserApiService, type UserInfo} from "../../generated";

const props = defineProps<{
  mid?: number;
}>();

const textarea = ref('')

const messages: Ref<TMessages[]> = ref([])
const userInfo: Ref<UserInfo> = ref({})
const currentUser = userStore().userInfo
onMounted(async () => {
  const res1 = await UserApiService.getUserInfoByUserIdUsingGet(props.mid);
  userInfo.value = res1.data
  const res = await AdvertisementApiService.getChatListUsingGet(props.mid);
  if (res.data !== undefined)
    messages.value = res.data
})
async function sendMessage() {
  await AdvertisementApiService.sendMessageUsingPost(props.mid,textarea.value)
  textarea.value = ''
  const res = await AdvertisementApiService.getChatListUsingGet(props.mid);
  if (res.data !== undefined)
    messages.value = res.data
}
</script>

<template>
  <MainLayout>
    <template #Header>
      <Header />
    </template>
    <template #Aside>
      <Aside />
    </template>
    <template #Main>
      <div class="flex justify-center items-center">
        <img :src="userInfo.avatar" class="w-10 h-10 r">
        <div>{{userInfo.nick}}</div>
      </div>
      <hr>

      <div v-for="message in messages" :key="messages.id">
        <div v-if="userInfo.id === message.senderId" class="flex">
          <img :src="userInfo.avatar" class="w-15 h-15 r" alt="">
          <div class="ml-5">
            <div>
              {{message.message}}
            </div>
            <div class="mt-4">
              {{message.sendTime}}
            </div>
          </div>
        </div>
        <div v-else class="flex">
          <img :src="currentUser.face" class="w-15 h-15 r" alt="">
          <div class="ml-5">
            <div>
              {{message.message}}
            </div>
            <div class="mt-4">
              {{message.sendTime}}
            </div>
          </div>
        </div>

        <br>
      </div>

      <div class="fixed bottom-10 left-60 w-50vw flex flex-col items-center">
        <el-input
            class="mt-2"
            v-model="textarea"
            :rows="2"
            size="large"
            type="textarea"
            placeholder="Please input"
        />
        <el-button class="mt-2" type="primary" @click="sendMessage">发送</el-button>
      </div>
    </template>
  </MainLayout>
</template>

<style scoped lang="scss">

</style>
