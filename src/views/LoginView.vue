<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'
import { JSEncrypt } from 'jsencrypt'
import { OpenAPI, type User, UserApiService } from '../../generated'

const phoneNumber = ref('')
const userPassword = ref('')

const user: Ref<User> = ref({
  createTime: undefined,
  email: undefined,
  id: undefined,
  phone: undefined,
  salt: undefined,
  updateTime: undefined,
  userInfo: undefined,
  userPassword: undefined,
})

const router = useRouter()

function toRegister() {
  router.push({ path: '/register' })
}

async function login() {
  try {
    user.value.phone = phoneNumber.value

    // 创建一个新的 JSEncrypt 实例
    const encrypt = new JSEncrypt()

    // 设置公钥
    const resPublicKey = await UserApiService.getRsaPublicKeyUsingGet()
    encrypt.setPublicKey(resPublicKey.data as string)

    // 加密密码
    const encryptedPassword = encrypt.encrypt(userPassword.value)
    if (!encryptedPassword) {
      // 加密失败，处理错误，例如显示错误消息或者抛出异常
      console.error('加密失败')
      return
    }
    user.value.userPassword = encryptedPassword

    const res = await UserApiService.loginUsingPost(user.value)
    if (res.code === '200') {
      // 将 token 保存在 OpenAPI 对象中
      OpenAPI.TOKEN = res.data

      //存储token
      localStorage.setItem('token',res.data)
      // 登录成功后，获取并设置用户信息
      await userStore().fetchData()
      await router.push({ path: '/home' })
    }
  }
  catch {

  }
}
</script>

<template>
  <div class="box">
    <div class="content">
      <div class="login-wrapper">
        <h1>登录</h1>
        <div class="login-form">
          <div class="username form-item">
            <span>使用邮箱或者手机号</span>
            <input v-model="phoneNumber" type="text" class="input-item">
          </div>
          <div class="password form-item">
            <span>密码</span>
            <input v-model="userPassword" type="password" class="input-item">
          </div>
          <button class="register-btn" @click="toRegister">
            注 册
          </button>
          <button class="login-btn" @click="login">
            登 录
          </button>
        </div>
        <div class="divider">
          <span class="line" />
          <span class="divider-text">其他方式登录</span>
          <span class="line" />
        </div>
        <div class="other-login-wrapper">
          <div class="other-login-item">
            <img src="../asset/QQ.png" alt="">
          </div>
          <div class="other-login-item">
            <img src="../asset/WeChat.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

/*公共CSS*/
.box {
  width: 100vw;
  height: 100vh;
  background-color: rgb(29, 67, 89);

  .content {
    .login-wrapper {
      h1 {
        text-align: center;
      }

      .login-form {
        .form-item {
          margin: 20px 0;

          span {
            display: block;
            margin: 5px 20px;
            font-weight: 100;
          }

          .input-item {
            width: 100%;
            border-radius: 40px;
            padding: 20px;
            box-sizing: border-box;
            font-size: 20px;
            font-weight: 200;

            &:focus {
              outline: none;
            }
          }
        }

        .register-btn {
          width: 45%;
          border-radius: 40px;
          color: #000;
          border: 0;
          font-weight: 100;
          margin-top: 10px;
          cursor: pointer;
        }

        .login-btn {
          width: 45%;
          border-radius: 40px;
          color: #fff;
          border: 0;
          font-weight: 100;
          margin-top: 10px;
          cursor: pointer;
          margin-left: 2vw;
        }
      }

      .divider {
        width: 100%;
        margin: 20px 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        span:nth-child(1) {
          flex: 1;
        }

        span:nth-child(3) {
          flex: 1;
        }

        .line {
          display: inline-block;
          max-width: 30%;
          width: 30%;
        }

        .divider-text {
          vertical-align: middle;
          margin: 0px 20px;
          line-height: 0px;
          display: inline-block;
          width: 100px;
        }
      }

      .other-login-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .other-login-item {
        border: 1px solid rgb(214, 222, 228);
        padding: 10px;
        margin: 10px;
        cursor: pointer;
      }
    }
  }
}

/*一般大于手机的尺寸CSS*/
@media (min-width: 767px) {
  .box {
    background-color: rgb(29, 67, 89);

    .content {
      width: 85vw;
      height: 90vh;
      background: url("../asset/login_two.jpg") no-repeat;
      background-size: 90% 100%;
      position: absolute;
      right: 15%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 20px;
      background-color: #fff;

      .login-wrapper {
        width: 25vw;
        position: absolute;
        right: 15%;
        top: 50%;
        transform: translateY(-50%);

        h1 {
          text-align: center;
          font-size: 45px;
          color: rgb(81, 100, 115);
          margin-bottom: 40px;
        }

        .login-form {
          margin: 10px 0;

          .form-item {
            span {
              color: rgb(81, 100, 115);
            }

            .input-item {
              height: 60px;
              border: 1px solid rgb(214, 222, 228);
            }
          }

          .login-btn {
            height: 50px;
            background-color: rgb(59, 72, 89);
            font-size: 20px;
          }

          .register-btn {
            height: 50px;
            background-color: rgb(255, 255, 255);
            font-size: 20px;
            border: 2px solid black;
          }
        }

        .divider {
          .line {
            border-bottom: 1px solid rgb(214, 222, 228);
          }
        }

        .other-login-item {
          border-radius: 20px;

          img {
            width: 40px;
            height: 40px;
          }
        }
      }
    }
  }
}

/*手机端CSS*/
@media (max-width: 768px) {
  .box {
    .content {
      width: 100vw;
      height: 100vh;
      background: url("../asset/login_bg_phone.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;

      .login-wrapper {
        width: 70%;
        height: 60%;
        padding-top: 15%;

        h1 {
          font-size: 30px;
          color: #fff;
        }

        .login-form {
          .form-item {
            margin: 10px 0;

            span {
              color: rgb(113, 129, 141);
            }

            .input-item {
              height: 30px;
              border: 1px solid rgb(113, 129, 141);
              background-color: transparent;
              color: #fff;
            }
          }

          .login-btn {
            height: 40px;
            background-color: rgb(235, 95, 93);
            font-size: 16px;
          }

          .register-btn {
            height: 40px;
            background-color: rgb(235, 95, 93);
            font-size: 16px;
          }
        }

        .divider {
          .line {
            border-bottom: 1px solid #fff;
          }

          .divider-text {
            color: #fff;
          }
        }

        .other-login-item {
          border-radius: 15px;

          img {
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  }
}
</style>
