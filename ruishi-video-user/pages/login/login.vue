<template>
  <view class="wrap">
    <view class="top"></view>
    <view class="content">
      <view class="title">欢迎登录</view>
      <u--form
        labelPosition="left"
        :model="loginForm"
        :rules="loginFormRules"
        ref="form1"
      >
        <u-form-item
          prop="username"
          label="手机号/邮箱"
          labelPosition="top"
          labelWidth="120px"
        >
          <u-input
            v-model="loginForm.username"
            :color="color"
            placeholder="手机号/邮箱"
            clearable
          />
        </u-form-item>
        <u-form-item
          prop="password"
          label="密码"
          labelPosition="top"
          labelWidth="120px"
        >
          <u-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            :color="color"
            border="surround"
          />
        </u-form-item>
        <!-- <u-form-item
          prop="code"
          label="验证码"
          labelPosition="top"
          labelWidth="120px"
          class="yzm-item"
        > 
          <u-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            :color="color"
            class="yzm"
            maxlength="4"
          >
          </u-input>
          <view class="showCode">1234</view>
        </u-form-item> -->
        <button @click="submit" class="getSmsCode">登录</button>
      </u--form>
      <view class="alternative">
        <view class="password" @click="passwordLogin()">忘记密码</view>
        <view>
          <view class="issue" @click="loginBy()">立即注册</view>
          <navigator url="/" class="issue">返回首页</navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
      },
      loginFormRules: {
        username: {
          type: 'string',
          required: true,
          message: '请输入手机号/邮箱',
          trigger: ['blur'],
        },

        password: {
          type: 'string',
          required: true,
          message: '请填写密码',
          trigger: ['blur'],
        },
        code: {
          type: 'string',
          required: true,
          len: 4,
          message: '请填写4位验证码',
          trigger: ['blur'],
        },
      },
      userName: '',
      password: '',
      color: '#050505',
      labelStyle: {
        color: '#fff',
      },
    }
  },
  computed: {},
  onLoad() {},
  methods: {
    async submit() {
       this.$store.dispatch('user/login', this.loginForm).then(() => {
		   uni.navigateTo({
		   	url:'/pages/index/index'
		   })
	   })
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
}
</script>

<style lang="scss" scoped>
$u-type-info: red;
$u-tips-color: blue;
$u-type-warning: green;

.wrap {
  font-size: 28rpx;

  .u-input {
    margin-top: 4px;
    border: 1px solid #999;
  }

  .u-form-item {
    height: 96px;
  }

  .yzm-item {
  }

  .yzm {
    margin-right: 20px;
  }

  .showCode {
    width: 120px;
    height: 36px;
    margin-top: 2px;
    border: 1px solid #999;
    color: #000;
  }

  .content {
    width: 600rpx;
    margin: 0 auto;
    padding-top: 80rpx;

    .title {
      text-align: left;
      font-size: 60rpx;
      font-weight: 500;
      margin-bottom: 100rpx;
    }

    input {
      text-align: left;
      margin-bottom: 10rpx;
      padding-bottom: 6rpx;
      background-color: #fff;
    }

    .tips {
      color: $u-type-info;
      font-size: 20rpx;
      margin-bottom: 60rpx;
      margin-top: 30rpx;
    }

    .getSmsCode {
      background-color: $global-color;
      color: #fff;
      border: none;
      font-size: 30rpx;
      padding: 12rpx 0;
      margin-top: 20px;

      &::after {
        border: none;
      }
    }

    .alternative {
      color: #333;
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
    }
  }

  .bottom {
    .loginType {
      display: flex;
      padding: 260rpx 150rpx 150rpx 150rpx;
      justify-content: space-between;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $u-content-color;
        font-size: 28rpx;
      }
    }

    .hint {
      padding: 20rpx 40rpx;
      font-size: 20rpx;
      color: $u-tips-color;

      .link {
        color: $u-type-warning;
      }
    }
  }
}
</style>
