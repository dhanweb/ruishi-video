<template>
  <view class="login-page">
    <u-navbar title="" leftIcon='' placeholder>
      <template slot="right">
        <view class="tips" @click="isLoginForm = !isLoginForm">
          {{isLoginForm?'立即注册':'立即登录'}}
        </view>
      </template>
    </u-navbar>
    <view class="login-body">
      <view class="main">
        <template v-if="isLoginForm">
          <view class="title">
            <h3>欢迎登录锐视视频网</h3>
            <text class="text">使用用户名登录</text>
          </view>
          <view class="form">
            <u--form :model="loginForm" :rules="loginFormRules" ref="loginRef">
              <u-form-item label="" prop="username">
                <u--input v-model="loginForm.username" placeholder="输入用户名"></u--input>
              </u-form-item>
              <u-form-item label="" prop="password">
                <u--input :password="!loginForm.showPass" v-model="loginForm.password" placeholder="输入密码"></u--input>
                <template slot="right">
                  <u-icon @click="togglePass(loginForm)" :name="loginForm.showPass?'lock-opened-fill':'lock-fill'"
                    size="28"></u-icon>
                </template>
              </u-form-item>
            </u--form>
            <view class="forgetpass">
              <navigator url="/pages/index/index">回到首页</navigator>
            </view>
            <view class="submit">
              <u-button class="submitBtn" :class="{loading}" text="登录" @click="submit" :loading="loading"></u-button>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="title">
            <h3>注册锐视视频网</h3>
            <!-- <text class="text">使用用户名登录</text> -->
          </view>
          <view class="form">
            <u--form :model="registerForm" :rules="registerFormRules" ref="registerRef">
              <u-form-item label="" prop="username">
                <u--input v-model="registerForm.username" placeholder="输入3-10位用户名"></u--input>
              </u-form-item>
              <u-form-item label="" prop="email">
                <u--input v-model="registerForm.email" placeholder="输入邮箱"></u--input>
              </u-form-item>
              <u-form-item label="" prop="password">
                <u--input :password="!registerForm.showPass" v-model="registerForm.password" placeholder="输入6-16位密码">
                </u--input>
                <u-icon @click="togglePass(registerForm)" :name="registerForm.showPass?'lock-opened-fill':'lock-fill'"
                  size="28"></u-icon>
              </u-form-item>
              <u-form-item label="" prop="password2">
                <u--input :password="!registerForm.showPass" v-model="registerForm.password2" placeholder="再次输入密码"></u--input>
              </u-form-item>
            </u--form>
            <view class="forgetpass">
              <navigator url="/pages/index/index">回到首页</navigator>
            </view>
            <view class="submit">
              <u-button class="submitBtn" :class="{loading}" text="注册" @click="submit" :loading="loading"></u-button>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapActions
  } from 'vuex'
  import {
    registerApi
  } from '../../api/user.js'
  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.registerForm.password) {
          return callback(new Error('两次密码不一致！'));
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: '',
          showPass: false,
        },
        registerForm: {
          username: '',
          email: '',
          password: '',
          password2: '',
          showPass: false,
          avatar: 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png'
        },
        loginFormRules: {
          username: {
            type: 'string',
            required: true,
            message: '请输入用户名',
            trigger: ['blur'],
          },

          password: {
            type: 'string',
            required: true,
            message: '请填写密码',
            trigger: ['blur'],
          }
        },
        registerFormRules: {
          username: {
            type: 'string',
            required: true,
            message: '请输入手机号',
            trigger: ['blur'],
          },
          email: {
            type: 'email',
            required: true,
            message: '请输入合法的邮箱',
            trigger: ['blur'],
          },

          password: {
            type: 'string',
            required: true,
            message: '请填写密码',
            trigger: ['blur'],
          },
          password2: [{
            type: 'string',
            required: true,
            message: '填写确认密码',
            trigger: ['blur'],
          }, {
            validator: validatePass2,
            trigger: 'blur'
          }, ]
        },
        isLoginForm: true,
        loading: false,

      }
    },
    computed: {},
    onLoad() {},
    methods: {
      togglePass(form) {
        form.showPass = !form.showPass
        console.log('form.showPass', form.showPass);
      },
      async submit() {
        this.loading = true
        if (this.isLoginForm) {
          this.$refs.loginRef.validate().then(res => {
            console.log('res', res);
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              uni.showToast({
                title: '登录成功',
                duration: 1500,
                success: () => {
                  setTimeout(() => {
                    uni.navigateTo({
                      url: '/pages/index/index'
                    })
                  }, 1500)
                }
              })
            })
          })
        } else {
          this.$refs.registerRef.validate().then(() => {
            registerApi(this.registerForm).then(() => {
              uni.showToast({
                title: '注册成功',
                duration: 1500,
              })
              this.isLoginForm = true
            })
          }).catch(err => {
            console.log(err, 'err');
          })
        }
        this.loading = false
      },
      loginBy(type) {
        this.$u.toast('开发中，敬请期待')
      },
      goPage(url) {
        this.$u.route({
          url: url,
        })
      },
    },
    watch: {
      isLoginForm: {
        handler(val) {
          if (!val) {
            console.log(1, val);
            this.$refs.loginRef.clearValidate()
          } else {
            console.log(2, val);
            this.$refs.registerRef.clearValidate()
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-page {
    .tips {
      font-size: 14px;
    }

    .login-body {
      .main {
        width: 80%;
        margin: 100px auto;

        .title {
          .text {
            color: #999;
            font-size: 15px;
          }
        }

        .form {
          // position: relative;
          margin-top: 40px;

          .u-form-item {
            height: 75px;
          }

          ::v-deep .u-form-item__body {
            border-bottom: 1px solid #ccc;
          }

          ::v-deep .u-form-item__body__right__message {
            margin-top: 4px;
            margin-left: 0 !important;
          }

          .forgetpass {
            font-size: 14px;
            color: #999;
            text-align: right;
          }

          .submit {
            margin-top: 30px;

            .submitBtn {
              background-color: #e40916;
              color: #fff;

              &.loading {
                background-color: #f56c6c;
              }
            }
          }
        }
      }
    }
  }
</style>
