<script setup lang="ts">
import {ref,reactive} from "vue";
import type {UserInfo, Video} from "../../generated";
import SparkMD5 from 'spark-md5';
import {FileApiService, UserApiService, VideoApiService} from "../../generated";

const video = ref<Video>({
      area: undefined, // 默认值，根据需要修改
      coins: undefined, // 默认值，根据需要修改
      collections: undefined, // 默认值，根据需要修改
      createTime: undefined, // 默认值，根据需要修改
      description: undefined, // 默认值，根据需要修改
      duration: '120', // 默认值，根据需要修改
      id: undefined, // 默认值，根据需要修改
      likes: undefined, // 默认值，根据需要修改
      thumbnail: undefined, // 默认值，根据需要修改
      title: undefined, // 默认值，根据需要修改
      type: undefined, // 默认值，根据需要修改
      updateTime: undefined, // 默认值，根据需要修改
      url: undefined, // 默认值，根据需要修改
      userId: undefined, // 默认值，根据需要修改
      videoTagList: [
        {
          createTime: "",
          id: undefined,
          tagId: 1,
          videoId: undefined
        }
      ], // 默认值，空数组
      views: undefined ,// 默认值，根据需要修改
    }
)

const userInfo = ref<UserInfo | null>(null)
//封面
const file1 = ref();
const md51 = ref('11');
const fmUrl = ref();

//视频
const file2 = ref();
const md52 = ref('11');
const videoUrl = ref();

const form = ref({
  title: '',
  type: '',
  area:'',
  description:'',
}
)

// const fetchUserInfo = async()=>{
//    const response = await UserApiService.getUserInfoByUserIdUsingGet(3)
//    userInfo.value = response.data
// }
const beforeUpload1 = async (file:any) => {
  try {
    console.log('用户上传的封面:', file);
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


    const response =  await FileApiService.uploadThumbnailFileUsingPut(
        file1.value,
        md51.value,

    )

    fmUrl.value = response.data

    console.log("fmurl：",fmUrl.value)
  } catch (error) {
    console.error('上传失败', error);
    throw error; // 将错误抛出，以便外部捕获
  }


};


const beforeUpload2 = async (file:any) => {
  try {
    console.log('用户上传的视频:', file);
    file2.value = file;

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
      md52.value = spark.end(true);// 注意这里传递了 true 表示以十六进制字符串的形式返回

    };

    // 以ArrayBuffer形式读取文件内容
    reader.readAsArrayBuffer(file);


    const response =  await FileApiService.uploadThumbnailFileUsingPut(
        file2.value,
        md52.value,
    )

    videoUrl.value = response.data

    console.log("videoUrl：",videoUrl.value)
  } catch (error) {
    console.error('上传失败', error);
    throw error; // 将错误抛出，以便外部捕获
  }


};

// const video1: Ref<Video> = ref({
//   area: 0,
//   createTime: undefined,
//   description: "yidadaa的github年度终结",
//   duration: "120",
//   id: undefined,
//   thumbnail: "https://try2b1st-photo-1311984591.cos.ap-guangzhou.myqcloud.com/bilibili/thumbnail/fdc9d199ca64825ab27e017d2c13be58.png",
//   title: "yidadaa的github年度终结",
//   type: "0",
//   updateTime: undefined,
//   url: "https://try2b1st-photo-1311984591.cos.ap-guangzhou.myqcloud.com/bilibili/be428c9358f6f2d80d93cafa0f41e788.mp4",
//   userId: undefined,
//   videoTagList: [
//     {
//       createTime: "",
//       id: 0,
//       tagId: 1,
//       videoId: 0
//     }
//   ]
// })
// function test(){
//    const response = VideoApiService.addVideosUsingPost(video1.value)
//
//   console.log("添加视频测试",response);
// }
//填充video
async function fillVideo() {
  try {
    console.log("点击上传");

    video.value.area = form.value.area;
    video.value.title = form.value.title;
    video.value.description = form.value.description;
    video.value.type = form.value.type;
    video.value.thumbnail = fmUrl.value;
    video.value.url = videoUrl.value;
    form.value.description += " ";

    const response = await VideoApiService.addVideosUsingPost(video.value);
    console.log(response);
  }catch (error){
    console.error(error);
  }

}
</script>

<template>
  <div>
    <Header></Header>
    <div  class="main">

      <div class="aside">
        <Aside ></Aside>
      </div>

      <div class="upload">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="上传封面" name="first">
            <el-upload
                class="upload-demo"
                drag
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
                :before-upload="beforeUpload1"
            >
              <img src="src/asset/img.png">
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <div class="el-upload__text">
                请上传封面
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div>
              </template>
            </el-upload>

<!--            <button @click="upload">返回fmurl</button>-->
          </el-tab-pane>
          <el-tab-pane label="上传视频" name="second">
            <el-upload
                class="upload-demo"
                drag
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
                :before-upload="beforeUpload2"

            >
              <img src="src/asset/img.png">
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <div class="el-upload__text">
                请上传视频
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
        </el-tabs>

        <div class="videoForm">
          <div class="form">
            <el-form  label-width="120px">

              <el-form-item label="视频类型">
                <el-select v-model="form.type" placeholder="选择视频类型" >
                  <el-option label="原创" value="0" />
                  <el-option label="转载" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="所选分区">
                <el-select v-model="form.area" placeholder="选择视频所选分区">
                  <el-option label="鬼畜" value="0" />
                  <el-option label="音乐" value="1" />
                  <el-option label="电影" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="视频标题">
                <el-input v-model="form.title" />
              </el-form-item>
              <el-form-item label="视频简介">
                <el-input v-model="form.description" />
              </el-form-item>


              <el-form-item>
                <el-button type="primary" @click="fillVideo">上传</el-button>
                <el-button>取消</el-button>

              </el-form-item>
            </el-form>
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

.main .upload{
  flex: 1;

  justify-content: center; /* 水平居中 */

}

.main .upload .demo-tabs{
  flex :1;
}

.videoForm{
  justify-content: center; /* 水平居中 */
}
.form{
  padding-left: 10%;
  padding-right: 40%;
}
</style>