<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {User, UserInfo} from "../../generated";
import {FileApiService, UserApiService} from "../../generated";
import type {UploadProps} from "element-plus";

import { ElMessage } from 'element-plus'
import SparkMD5 from "spark-md5";



const form = ref({
  nick: '',
  sign:'',
  email:'',
  phone:'',
  birth: '',
  sex: '',

})


const userInfo = ref<UserInfo>(
    {
      avatar: undefined,
      birth: undefined,
      createTime: undefined,
      followed: undefined,
      gender:undefined,
      id: undefined,
      nick: undefined,
      sign: undefined,
      updateTime: undefined,
      userId: undefined,
    }
)

const user = ref<User>(
    {
      createTime: undefined,
      email: undefined,
      id: undefined,
      phone: undefined,
      salt: undefined,
      updateTime: undefined,
      userInfo: undefined,
      userPassword: undefined,
    }
)

const fetchUserInfo = async()=>{
  try {
    const response = await UserApiService.getUserInfoUsingGet();
    console.log(response)
    userInfo.value.nick = response.data.userInfo.nick;
    userInfo.value.avatar = response.data.userInfo.avatar;
    userInfo.value.birth = response.data.userInfo.birth;
    // userInfo.value.createTime = response.data.userInfo.createTime;
    userInfo.value.followed = response.data.userInfo.followed;
    userInfo.value.gender = response.data.userInfo.gender;
    userInfo.value.id = response.data.userInfo.id;
    userInfo.value.sign = response.data.userInfo.sign;
    // userInfo.value.updateTime = response.data.userInfo.updateTime;
    userInfo.value.userId = response.data.userInfo.userId;


  }catch (error)
  {
    console.error("获取用户信息失败",error)
  }
}
const fetchUser = async()=>{
  try {
    const response = await UserApiService.getUserInfoUsingGet();

    user.value.email = response.data.email;
    user.value.phone = response.data.phone;

  }catch (error)
  {
    console.error("获取用户信息失败",error)
  }
}

const save = async()=>{
  try {
    const response2 = await UserApiService.updateUserInfosUsingPut(userInfo.value);

    console.log("更新userInfo",response2);
    alert("修改成功")
  }catch (error)
  {
    console.error("保存用户信息失败",error)
    alert("修改失败")
  }
}
const file1 = ref();
const md51 = ref('');

const avatar = ref();
const beforeUpload = async (file:any) => {
  try {
    console.log('用户上传的头像:', file);
    file1.value = file;

    // 创建一个FileReader对象
    const reader = new FileReader();

    // 当文件读取完成时触发事件
    reader.onload = () => {

      // 获取文件内容
      const fileContent = reader.result as ArrayBuffer;

      // 计算MD5值
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(fileContent);

      // 将MD5值保存到ref
      md51.value = spark.end(true);// 注意这里传递了 true 表示以十六进制字符串的形式返回

    };

    // 以ArrayBuffer形式读取文件内容
    reader.readAsArrayBuffer(file);

    const resMd5 = await FileApiService.getFileMd5UsingPost(file1.value);
    md51.value = resMd5.data

    const response =  await FileApiService.uploadThumbnailFileUsingPut(
        file1.value,
        md51.value,
    )

    avatar.value = response.data
    userInfo.value.avatar = avatar.value;

    console.log("avatar：",avatar.value)
  } catch (error) {
    console.error('上传失败', error);
    throw error; // 将错误抛出，以便外部捕获
  }

}

const update = async()=>{

try {
  await UserApiService.updateUserInfosUsingPut(userInfo.value);
  await userStore().fetchData()
  alert("修改成功")
}catch (error)
{
  alert("修改失败")
}

}
onMounted(async () => {
  await fetchUserInfo();
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

      <div class="userInfo">
          <img src="src/asset/img_1.png">
        <el-tabs class="demo-tabs" >
          <div class="myInfo">
            <el-tab-pane label="我的信息" name="first">
              <el-form :model="form" label-width="120px">
            <el-form-item label="昵称">
              <el-input v-model="userInfo.nick" placeholder="输入您的昵称" />
            </el-form-item>
                <el-form-item label="签名">
                <el-input  v-model="userInfo.sign" placeholder="设置您的签名"/>
              </el-form-item>
                <el-form-item label="出生日期">
                  <el-input  v-model="userInfo.birth" placeholder="设置您的出生日期 如2003-5-18"/>
                </el-form-item>


            <el-form-item label="性别">
              <el-radio-group v-model="userInfo.gender">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <el-radio label="2">保密</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
            </el-tab-pane>

            <el-tab-pane label="我的头像" name="second">

              <el-upload
                  class="upload-demo"
                  drag
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  multiple
                  :before-upload="beforeUpload"
              >
                <img src="src/asset/img.png">
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <div class="el-upload__text">
                  请上传头像
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                  </div>
                </template>
              </el-upload>
              <el-button type="primary" @click="update">上传</el-button>
            </el-tab-pane>
          </div>


        </el-tabs>

        <div class="videoForm">
          <div class="form">

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

.main .userInfo{
  flex: 1;

  justify-content: center; /* 水平居中 */

}

.myInfo{
  padding-right:20% ;
  padding-left: 3%;
}


.videoForm{
  justify-content: center; /* 水平居中 */
}

.myAvatar{
  padding-left: 20%;

}
.Avatar{

  width: 200px;
  height: 200px;

  background-size: cover; /* 使用 cover 值让背景图片自适应填满整个圆形区域 */
  background-position: center; /* 设置背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  border-radius: 50%; /* 将 border-radius 设置为50%以创建圆形 */
}
</style>
