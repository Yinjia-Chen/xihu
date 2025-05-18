<script setup lang="ts">
import type { Ref } from 'vue'
// 引入 userStore
import useUserStore from '@/store/modules/user'
// 引入 layoutSettingStore
import useLayoutSettingStore from '@/store/setting'
// 引入 登录成功后的 早中晚
import time from '@/utils/time'
// 引入 element-plus 组件
import { ElMessage, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// 引入子组件
import Footer from './footer/index.vue'
import Main from './main/index.vue'
import Sidebar from './sidebar/index.vue'
import Tabbar from './tabbar/index.vue'

// 使用 userStore
const userStore = useUserStore()
const {
  accLogForm,
  phoneLogForm,
  regForm,
  userData,
  accLogin,
  phoneLogin,
  registerAcc,
  clearLogForm,
  clearRegForm,
} = userStore

// 使用 layoutSettingStore
const layoutSettingStore = useLayoutSettingStore()
const { dialogFormVisible, dialogRegisterVisible, isLog } = storeToRefs(layoutSettingStore)

const isAccLog = ref<boolean>(true)
const logForm1 = ref()
const logForm2 = ref()
const registerForm = ref()

// 图片验证码地址
const captchaUrl = ref('http://8.130.145.109:8080/dev-api/captcha/get')
function refreshCaptcha() {
  const timestamp = new Date().getTime()
  captchaUrl.value = `http://8.130.145.109:8080/dev-api/captcha/get?timestamp=${timestamp}`
}

// 创建响应式对象,检查验证码发送状态,记录倒计时
interface RefObject {
  [key: string]: Ref<number> | Ref<boolean>
}
const isSendingCode: RefObject = {
  1: ref(false),
  2: ref(false),
}
const countdown: RefObject = {
  1: ref(0),
  2: ref(0),
}

// 发送验证码，调验证码接口
function sendVerificationCode(num: string) {
  // 检查手机号是否有效
  isSendingCode[num].value = true
  countdown[num].value = 60
  // 倒计时效果
  const countdownInterval = setInterval(() => {
    ;(countdown[num].value as number)--
    if ((countdown[num].value as number) <= 0) {
      clearInterval(countdownInterval)
      isSendingCode[num].value = false
    }
  }, 1000)
}

// 清空表单并刷新验证码
watch(isAccLog, () => {
  clearLogForm()
  refreshCaptcha()
})
watch(dialogFormVisible, () => {
  clearLogForm()
  if (dialogFormVisible.value === true) {
    refreshCaptcha()
  }
})
watch(dialogRegisterVisible, () => {
  clearRegForm()
  refreshCaptcha()
})

// 表单校验判断及处理函数
function validatorPassword(_rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  const lengthCheck = value.length >= 6 && value.length <= 15
  const lowercaseCheck = /[a-z]/.test(value)
  const uppercaseCheck = /[A-Z]/.test(value)
  const numberCheck = /\d/.test(value)

  if (lengthCheck && lowercaseCheck && uppercaseCheck && numberCheck) {
    callback()
  } else {
    let errorMessage = '密码必须包含大写字母、小写字母和数字'
    if (!lengthCheck) {
      errorMessage = '密码长度应当为6-15位'
    }
    callback(new Error(errorMessage))
  }
}
function validatePwdCheck(_rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== regForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
function validatorAccount(_rule: any, value: any, callback: any) {
  // 检查是否输入了值
  if (!value) {
    return callback(new Error('请输入账号'))
  }
  // 检查长度限制
  if (value.length < 5 || value.length > 10) {
    return callback(new Error('账号名长度在5-10位'))
  }
  // 检查是否包含特殊字符或中文
  if (!/^[a-z0-9]+$/i.test(value)) {
    return callback(new Error('账号名不能包含特殊字符或中文'))
  }
  // 如果所有检查都通过，则调用 callback() 无参数表示验证通过
  callback()
}
function validatorCaptcha(_rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('请输入图形验证码'))
  }
  if (value.length !== 4) {
    return callback(new Error('验证码长度为4'))
  }
  callback()
}
function validatorPhone(_rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  if (value.length !== 11) {
    return callback(new Error('手机号长度为11位'))
  }
  callback()
}
function validatorVerifyCode(_rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('请输入短信验证码'))
  }
  callback()
}
function validatorUsername(_rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }
  callback()
}

// 登录表单校验
const rules1 = {
  account: [{ validator: validatorAccount, trigger: 'change' }],
  password: [{ trigger: 'change', validator: validatorPassword }],
  captcha: [{ trigger: 'blur', validator: validatorCaptcha }],
}
const rules2 = {
  phone: [{ validator: validatorPhone, trigger: 'change' }],
  verifyCode: [{ validator: validatorVerifyCode, trigger: 'blur' }],
  captcha: [{ trigger: 'blur', validator: validatorCaptcha }],
}

const $router = useRouter()

// 登陆逻辑
async function login() {
  if (isAccLog.value) {
    // 账号登录
    await logForm1.value.validate()
    await accLogin(accLogForm)
      .then(() => {
        dialogFormVisible.value = false
        ElNotification({
          title: `hi! ${userData.username},${time()}好`,
          message: '欢迎登录',
        })
        isLog.value = true
        $router.push('/home')
      })
      .catch((error) => {
        // 登录失败的通知
        ElMessage({
          message: `${error.message}`,
          type: 'error',
        })
      })
  } else {
    // 手机号登录
    await logForm2.value.validate()
    await phoneLogin(phoneLogForm)
      .then(() => {
        // 显示通知
        dialogFormVisible.value = false
        ElNotification({
          title: `hi! ${userData.username},${time()}好`,
          message: '欢迎登录',
          type: 'success',
        })
        isLog.value = true
      })
      .catch((error) => {
        // 登录失败的通知
        ElMessage({
          message: `${error.message}`,
          type: 'error',
        })
      })
  }
}

// 关闭登录窗口
function closeLogin() {
  dialogRegisterVisible.value = false
}

// 回到登陆
function backLogin() {
  dialogRegisterVisible.value = false
}

// 注册步骤记录
const activeStep = ref(0)

// 注册表单校验
const rules3 = {
  username: [{ validator: validatorUsername, trigger: 'change' }],
  account: [{ validator: validatorAccount, trigger: 'change' }],
  phone: [{ validator: validatorPhone, trigger: 'change' }],
  verifyCode: [{ validator: validatorVerifyCode, trigger: 'blur' }],
  password: [{ trigger: 'change', validator: validatorPassword }],
  checkPwd: [{ trigger: 'change', validator: validatePwdCheck }],
}

// 注册->上一步
function prev() {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 注册->下一步
function next() {
  if (activeStep.value < 2) {
    registerForm.value.validate((valid: any) => {
      if (valid) {
        activeStep.value++
      }
    })
  }
}

// 注册按钮回调
async function register() {
  await registerForm.value.validate()
  registerAcc(regForm)
    .then(() => {
      dialogRegisterVisible.value = false
      ElMessage({
        message: '注册成功',
        type: 'success',
      })
    })
    .catch((err) => {
      ElMessage({
        message: `注册失败，${err.message}`,
        type: 'error',
      })
    })
}
</script>

<template>
  <div class="layout">
    <!-- 顶栏 -->
    <Tabbar class="tabbar" />

    <!-- 主体 -->
    <Main class="main" />

    <!-- 侧栏 -->
    <Sidebar class="sidebar" />

    <!-- 底栏 -->
    <Footer class="footer" />

    <!-- 注册｜登陆 对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      class="dialog"
      width="14.5rem"
      :show-close="false"
      style="
        height: 7.5rem;
        border-radius: 0.0625rem;
        opacity: 0.95;
        box-shadow: 0rem 0.1143rem 0.3429rem #000000;
        position: relative;
        padding: 0;
        display: flex;
        justify-content: center;
        align-content: center;
        overflow: hidden;
        background-color: #f2f0f3;
      "
      @close="closeLogin"
    >
      <div
        class="login_wrapper"
        :class="dialogRegisterVisible === true ? 'register-wrapper-show' : 'login-wrapper-show'"
      >
        <!-- 登陆盒子 -->
        <div class="login_container">
          <!-- 头部 -->
          <div class="header">
            <div class="title">西湖论剑·数字安全大会</div>
            <div class="login">
              <span :class="{ login1: isAccLog }" @click="isAccLog = true">账号</span>
              <span :class="{ login2: !isAccLog }" @click="isAccLog = false">手机号</span>
            </div>
          </div>
          <!-- 账号登录表单 -->
          <el-form
            v-show="isAccLog"
            ref="logForm1"
            label-width=".3571rem"
            :rules="rules1"
            :model="accLogForm"
          >
            <el-form-item prop="account">
              <el-input v-model="accLogForm.account" placeholder="请输入账号">
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="accLogForm.password"
                placeholder="请输入密码"
                type="password"
                show-password
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 0.0714rem" prop="captcha">
              <el-input v-model="accLogForm.captcha" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <Key />
                  </el-icon>
                </template>
                <template #suffix>
                  <img
                    :src="captchaUrl"
                    class="captcha"
                    alt="点击重新加载"
                    @click="refreshCaptcha"
                  />
                </template>
              </el-input>
            </el-form-item>
            <div class="register" @click="dialogRegisterVisible = true">没有账号？点击注册</div>
            <!-- 登录按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                style="width: 4.7339rem; border-radius: 0.2429rem"
                :loading="false"
                @click="login"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <!-- 手机号登陆表单 -->
          <el-form
            v-show="!isAccLog"
            ref="logForm2"
            label-width=".3571rem"
            :rules="rules2"
            :model="phoneLogForm"
          >
            <el-form-item prop="phone">
              <el-input v-model="phoneLogForm.phone" placeholder="请输入手机号码">
                <template #prefix>
                  <el-icon>
                    <Iphone />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-input v-model="phoneLogForm.verifyCode" placeholder="请输入短信验证码">
                <template #prefix>
                  <el-icon>
                    <Bell />
                  </el-icon>
                </template>
                <template #suffix>
                  <el-button
                    size="small"
                    :disabled="
                      isSendingCode['1'].value === true || (countdown['1'].value as number) > 0
                    "
                    class="sendCode"
                    @click="() => sendVerificationCode('1')"
                  >
                    {{
                      (countdown['1'].value as number) > 0
                        ? `重新发送(${countdown['1'].value})`
                        : '发送验证码'
                    }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 0.0714rem" prop="captcha">
              <el-input v-model="phoneLogForm.captcha" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <Key />
                  </el-icon>
                </template>
                <template #suffix>
                  <img
                    :src="captchaUrl"
                    class="captcha"
                    alt="点击重新加载"
                    @click="refreshCaptcha"
                  />
                </template>
              </el-input>
            </el-form-item>

            <div class="register" @click="dialogRegisterVisible = true">没有账号？点击注册</div>

            <el-form-item>
              <el-button
                type="primary"
                style="width: 4.7339rem; border-radius: 0.2429rem"
                :loading="false"
                @click="login"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <!-- 其他登录方式 -->
          <div class="other">
            <div class="otherLogin">更多方式</div>
            <div style="margin-top: 0.0429rem">@@</div>
          </div>
          <!-- 底部说明 -->
          <div class="bottom">
            <div class="explain">登录视为您已同意第三方账号绑定协议、服务条款、隐私政策</div>
          </div>
        </div>
        <!-- 背景图盒子 -->
        <div class="image_bg">
          <div v-show="dialogRegisterVisible" class="backLogin" @click="backLogin">已有帐号？</div>
        </div>
        <!-- 注册盒子 -->
        <div class="register_container">
          <div class="register-header">
            <span style="margin-right: 0.0714rem">注册用户</span>
          </div>
          <div class="regisnter-content">
            <el-steps
              :active="activeStep"
              finish-status="success"
              align-center
              style="margin-top: 0.1875rem"
            >
              <el-step title="手机号" />
              <el-step title="密码" />
              <el-step title="基本信息" />
            </el-steps>
            <el-form
              ref="registerForm"
              label-position="right"
              label-width="1.0714rem"
              :model="regForm"
              :rules="rules3"
              style="height: 2.5714rem"
            >
              <div v-if="activeStep === 0" class="Step3">
                <el-form-item label="手机号" prop="phone" style="width: 5.4286rem">
                  <el-input v-model="regForm.phone" placeholder="请设置手机号">
                    <template #prefix>
                      <el-icon>
                        <Phone />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="verifyCode" style="width: 5.4286rem">
                  <el-input v-model="regForm.verifyCode" placeholder="请输入验证码">
                    <template #prefix>
                      <el-icon>
                        <Bell />
                      </el-icon>
                    </template>
                    <template #suffix>
                      <el-button
                        v-show="!isAccLog"
                        size="small"
                        :disabled="
                          isSendingCode['2'].value === true || (countdown['2'].value as number) > 0
                        "
                        class="sendCode"
                        @click="() => sendVerificationCode('2')"
                      >
                        {{
                          (countdown['2'].value as number) > 0
                            ? `重新发送(${countdown['2'].value})`
                            : '发送验证码'
                        }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <div
                v-if="activeStep === 1"
                class="Step2"
                style="
                  height: 2.019rem;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                "
              >
                <el-form-item
                  label="密码"
                  prop="password"
                  style="width: 5.4286rem"
                  label-width="1.25rem"
                >
                  <el-input
                    v-model="regForm.password"
                    placeholder="请设置密码"
                    type="password"
                    show-password
                  >
                    <template #prefix>
                      <el-icon>
                        <Key />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="确认密码"
                  prop="checkPwd"
                  style="width: 5.4286rem"
                  label-width="1.25rem"
                >
                  <el-input
                    v-model="regForm.checkPwd"
                    placeholder="请再次输入密码"
                    show-password
                    type="password"
                  >
                    <template #prefix>
                      <el-icon>
                        <Key />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              <div v-if="activeStep === 2" class="Step1">
                <!-- 上传头像 -->
                <el-row>
                  <!-- <el-col
                    :span="8.5"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 0.1875rem;
                    "
                  >
                    <div
                      style="
                        margin-right: 0.2143rem;
                        font-size: 0.2286rem;
                        margin-left: 0.375rem;
                      "
                    >
                      头像
                    </div>
                    <el-upload
                      class="avatar-uploader"
                      action="/dev-api/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img
                        v-if="regForm.avatar"
                        :src="regForm.avatar"
                        class="avatar"
                      />
                      <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                      </el-icon>
                    </el-upload>
                  </el-col> -->
                  <el-col
                    :span="12.5"
                    style="
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      height: 2.019rem;
                    "
                  >
                    <el-form-item label="用户名" prop="username" style="width: 5.4286rem">
                      <el-input v-model="regForm.username" placeholder="请设置用户名">
                        <template #prefix>
                          <el-icon>
                            <User />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="账号" prop="account" style="width: 5.4286rem">
                      <el-input v-model="regForm.account" placeholder="请设置账号">
                        <template #prefix>
                          <el-icon>
                            <Avatar />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="stepBtn">
                <el-button :disabled="activeStep === 0" type="primary" text @click="prev">
                  上一步
                </el-button>
                <el-button v-if="activeStep !== 2" type="primary" @click="next">下一步</el-button>
                <el-button v-if="activeStep === 2" type="primary" @click="register">
                  确认注册
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.layout {
  background-color: #fafafa;
  position: relative;
  /* 测试属性 start */
  overflow: hidden;

  /* 测试属性end */
  .tabbar {
    position: fixed;
    z-index: 999;
    width: 100%;
  }

  .footer {
    position: absolute;
    bottom: 0;
    z-index: 999;
  }

  .main {
    padding-top: 1rem;
    margin-bottom: 8rem;
  }

  .sidebar {
    position: fixed;
    z-index: 9999;
    bottom: 1.25rem;
    right: 0.375rem;
  }

  .header {
    margin: calc(1.0857rem - 0.5429rem - 0.2571rem) calc(1.6rem - 0.8571rem - 0.2857rem) 0.3214rem;

    .title {
      font-weight: bold;
      font-size: 0.375rem;
      color: #000;
      margin-bottom: 0.2875rem;
    }

    .login {
      height: 0.4571rem;
      display: flex;
      align-items: center;
    }

    .login span {
      cursor: pointer;
      margin-right: 0.2571rem;
      font-size: 0.2rem;
      height: 0.3125rem;
      transition: all 0.3s ease;
      /* 过渡动画效果 */
    }

    .login1 {
      color: #409eff;
      border-bottom: 0.025rem #409eff solid;
    }

    .login2 {
      color: #409eff;
      border-bottom: 0.025rem #409eff solid;
    }
  }

  .el-form-item {
    width: 4.7321rem;

    .el-input {
      height: 0.5286rem;
      border-radius: 0.0857rem;
    }

    .sendCode {
      padding: 0 0.1429rem;
      font-size: 0.1714rem;
      border: none;
    }
  }

  .register {
    font-size: 0.1429rem;
    width: 4.7321rem;
    margin: 0.1339rem 0;
    text-align: right;
    cursor: pointer;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }

  .other {
    margin-left: 0.3571rem;
    margin-bottom: 0.1429rem;
    font-size: 0.1429rem;
    display: flex;
    width: 4.375rem;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    .otherLogin {
      margin: 0 auto;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #ebeef5;
        left: -110%;
        top: 50%;
      }

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #ebeef5;
        right: -110%;
        top: 50%;
      }
    }
  }

  .bottom {
    margin-left: 0.3571rem;
    height: 0.2857rem;
    margin-bottom: 0.2875rem;

    .explain {
      font-size: 0.1714rem;
    }
  }
  .login_wrapper {
    display: flex;
    position: absolute;
    overflow: hidden;
    height: 7.5rem;
    width: 20.3rem;
    right: 0;
    background-color: rgba(69, 127, 202, 0.21);
  }
  .login_container {
    padding: 0.875rem 0 1.25rem 0.3125rem;
    background-color: #fff;
    width: 5.8rem;
  }

  .image_bg {
    width: 8.7rem;
    background: url('@/assets/images/bg_images/login_bg.png') no-repeat center;
    background-size: 65%;
    position: relative;
    transition: background-image 0.5s ease-in-out;

    .backLogin {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0.625rem;
      cursor: pointer;
      transition: all 0.5s ease-in-out;

      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }
  }

  .register-bg-show {
    background-image: url('@/assets/images/bg_images/register_bg.png');
  }

  .el-dialog__body {
    position: relative;
  }
}

.register_container {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 5.8rem;
  height: 8.125rem;
  padding-top: 0.625rem;
  background-color: #fff;
  .register-header {
    display: flex;
    align-items: center;
    padding-left: 0.1429rem;
    margin: 0.0714rem auto;
    width: 2rem;
    font-size: 0.3429rem;
    border-left: 0.0429rem solid #76b4f5;
    line-height: 0.3571rem;
  }
}

.login-wrapper-show {
  left: 0;
  transition: left 0.3s ease-in-out;
}

.register-wrapper-show {
  left: -5.8rem;
  transition: left 0.3s ease-in-out;
}

img {
  cursor: pointer;
}

.avatar-uploader .avatar {
  width: 2rem;
  height: 2rem;
  display: block;
}

div[class^='Step'] {
  margin-top: 0.2857rem;
}

.Step2,
.Step3 {
  height: 2.019rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stepBtn {
  margin: 0 auto;

  width: 2.5714rem;
}
::v-deep .el-step__head.is-success {
  color: rgb(52, 158, 250);
  border-color: rgb(52, 158, 250);
}
::v-deep .el-step__title.is-success {
  font-weight: bold;
  color: rgb(52, 158, 250);
}
::v-deep .el-step__description.is-success {
  color: rgb(52, 158, 250);
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 0.0143rem dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 0.4rem;
  color: #8c939d;
  width: 2rem;
  height: 2rem;
  text-align: center;
}

.captcha {
  width: 1.2857rem;
  height: 0.3571rem;
  border: none;
  line-height: 0.3571rem;
  font-size: 0.1714rem;
  vertical-align: bottom;
}
/* // 修改element-ui的el-step样式 */
</style>
