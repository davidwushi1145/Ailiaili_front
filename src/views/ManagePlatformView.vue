<script setup lang="ts">
import { computed } from 'vue'
import type {Danmu, User} from "../../generated";
import { DanmuApiService,  UserApiService} from "../../generated";
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


const fetchDanMu = async()=>{

  try {

    const response = await DanmuApiService.getUnpassDanmusUsingGet(1,100);

    danmus.splice(0,danmus.length,...response.data.list)
    // danmus1.value = response.data.list;
    console.log("danmu",response);
  }catch (error){
    console.error(error);
  }

}
const fetchUser = async()=>{

  try {

    const response = await UserApiService.getUserInfoUsingGet();
    users.splice(0,users.length,...response.data)
    // danmus1.value = response.data.list;
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
                          用户昵称
                        </div>
                      </template>
                      {{ user.createTime }}
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
                      <el-select  placeholder="禁用" style="width: 100px">
                        <el-option label="禁用" value="0" />
                        <el-option label="允许" value="1" />
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

                          type="password"
                          placeholder="Please input password"
                          show-password
                      />
                    </el-descriptions-item>
                  </el-descriptions>

                  <div class="submit">
                    <el-button type="primary" >修改</el-button>
                  </div>

                  <el-divider />
                </div>
                </el-tab-pane>
              <el-tab-pane label="权限管理" name="third">
                权限管理
                <el-icon><SwitchButton /></el-icon></el-tab-pane>
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