<script setup lang="ts">
import { computed } from 'vue'
import type {Danmu, User} from "../../generated";
import {DanmuApiService, UserApiService, UserAuthApiService} from "../../generated";
import {onMounted, ref,reactive} from "vue";
const size = ref('')
const iconStyle = computed(() => {
  const marginMap: Record<string, string> = {
    large: '8px',
    default: '6px',
    small: '4px',
  };
  return {
    marginRight: marginMap[size.value as keyof typeof marginMap] || marginMap.default,
  };
});

const danmus = reactive<Danmu[]>([])

const users = reactive<User[]>([])

const selectedUser = ref<User>({
  createTime: undefined,
  email: undefined,
  id: undefined,
  phone: undefined,
  salt: undefined,
  updateTime: undefined,
  userInfo: undefined,
  userPassword: undefined,
})

const fetchDanMu = async()=>{

  try {

    const response = await DanmuApiService.getUnpassDanmusUsingGet(1,100);
        danmus.splice(0,danmus.length, ...response.data.list)
    console.log("danmu",response);
    // console.log("userInfo",response1);
  }catch (error){
    console.error(error);
  }

}
const fetchUser = async()=>{

  try {

    const response = await UserApiService.getAllUserUsingGet();
    users.splice(0,users.length,...response.data)


    console.log("user",response.data);
  }catch (error){
    console.error(error);
  }

}
const passDanmu = async(danmuId:any)=>{
  try {

    await DanmuApiService.passDanmuUsingPost(danmuId).then(()=>fetchDanMu())
    // location.reload()
  }catch (error){
    console.error(error);
  }

}

const update = async (user: any)=>{
  try {
    selectedUser.value = user;

    const response = await UserApiService.updateSignificantUserUsingPut(user)
    console.log("修改用户",response.data);
  }catch (error){
    console.error(error);
  }

}
const text = async ()=>{
  try {
   const response = await UserAuthApiService.getUserAuthoritiesUsingGet();
    console.log("权限",response.data);
  }catch (error){
    console.error(error);
  }

}
onMounted(async () => {
  await fetchDanMu();
  await fetchUser();
});

</script>

<template>
  <div>
    <Header></Header>
    <div  class="main">

      <div class="aside">
        <Aside ></Aside>
      </div>

      <div class="managePlatform">


        <div class="platform">
          <div class="form">
            <el-tabs >

              <el-tab-pane label="社区管理" name="first">
                <div class="danmu"  v-for="danmu in danmus"  :key="danmu.id">
                  <el-descriptions
                      class="margin-top"
                      title="弹幕审核"
                      :column="3"
                      :size="size"
                      border
                      >
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <user />
                          </el-icon>
                          用户id
                        </div>
                      </template>
                      {{ danmu.userId}}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <ChatLineSquare />
                          </el-icon>
                          视频id
                        </div>
                      </template>
                      {{ danmu.videoId }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <Timer />
                          </el-icon>
                          发布时间
                        </div>
                      </template>
                      {{ danmu.createTime}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <WarningFilled />
                          </el-icon>
                          当前状态
                        </div>
                      </template>
                      {{ danmu.pass === 0 ? '禁用' : '允许' }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <office-building />
                          </el-icon>
                          弹幕内容
                        </div>
                      </template>
                      {{ danmu.content }}
                    </el-descriptions-item>
                  </el-descriptions>

                  <div class="submit">
                    <el-button type="primary" @click="passDanmu(danmu.id)">通过</el-button>
                  </div>

                  <el-divider />

                </div>

              </el-tab-pane>


              <el-tab-pane label="用户管理" name="second">
                <div class="user"  v-for="user in users"  :key="user.id">
                  <el-descriptions
                      class="margin-top"
                      title="用户管理"
                      :column="3"
                      :size="size"
                      border
                  >
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <user />
                          </el-icon>
                          用户id
                        </div>
                      </template>
                      {{user.id}}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <ChatLineSquare />
                          </el-icon>
                          用户名
                        </div>
                      </template>
                      {{ user.phone }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <Timer />
                          </el-icon>
                          创建时间
                        </div>
                      </template>
                      {{ user.createTime}}
                    </el-descriptions-item>


                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <WarningFilled />
                          </el-icon>
                          当前状态
                        </div>
                      </template>
<!--                      {{ user.pass === 0 ? '冻结状态' : '解冻状态' }}-->
                      <el-select  v-model="user.pass" placeholder="禁用" style="width: 100px">
                        <el-option label="冻结" value="0" />
                        <el-option label="解冻" value="1" />
                      </el-select>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon :style="iconStyle">
                            <office-building />
                          </el-icon>
                          用户密码
                        </div>
                      </template>
                      <el-input
                          v-model="user.userPassword"
                          type="password"
                          placeholder="Please input password"
                          show-password
                      />
                    </el-descriptions-item>
                  </el-descriptions>

                  <div class="submit">
                    <el-button type="primary"  @click="update(user)">修改</el-button>
                  </div>

                  <el-divider />
                </div>
                </el-tab-pane>


<!--              <el-tab-pane label="权限管理" name="third">-->

<!--                <div class="userAuths">-->

<!--                  <el-descriptions-->
<!--                      class="margin-top"-->
<!--                      title="用户权限"-->
<!--                      :column="3"-->
<!--                      :size="size"-->
<!--                      border-->
<!--                  >-->
<!--                    <el-descriptions-item>-->
<!--                      <template #label>-->
<!--                        <div class="cell-item">-->
<!--                          <el-icon :style="iconStyle">-->
<!--                            <user />-->
<!--                          </el-icon>-->
<!--                          用户id-->
<!--                        </div>-->
<!--                      </template>-->
<!--                      kooriookami-->
<!--                    </el-descriptions-item>-->
<!--                    <el-descriptions-item>-->
<!--                      <template #label>-->
<!--                        <div class="cell-item">-->
<!--                          <el-icon :style="iconStyle">-->
<!--                            <iphone />-->
<!--                          </el-icon>-->
<!--                          用户拥有的权限-->
<!--                        </div>-->
<!--                      </template>-->
<!--                      18100000000-->
<!--                    </el-descriptions-item>-->

<!--                  </el-descriptions>-->

<!--                  <div class="submit">-->
<!--                    <el-button type="primary" >修改</el-button>-->
<!--                  </div>-->


<!--                  <el-button type="primary" @click="text">测试</el-button>-->
<!--                  <el-divider />-->

<!--                </div>-->
<!--              </el-tab-pane>-->
            </el-tabs>
          </div>

        </div>

      </div>
    </div>


  </div>
</template>

<style scoped lang="scss">
.main{
  display: flex;
}

.managePlatform{
  flex: 1;

  justify-content: center; /* 水平居中 */

}

.submit{
  padding-top: 20px;
}


</style>
