<template>
  <view class="collect-page">
    <u-navbar title="收藏" :autoBack="true" safeAreaInsetTop placeholder bgColor="#f6f6f6" />
    <view class="collect-list">
      <template v-for="item in collectList">
        <rs-card horizontal :video="item.video" :key="item.collect_id"></rs-card>
      </template>
    </view>
    <u-loadmore marginTop="30" :status="status" />
  </view>
</template>

<script>
  import {
    getCollectApi
  } from '../../api/user'
  export default {
    data() {
      return {
        status: 'nomore',
        collectList: []
      }
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        const result = await getCollectApi()
        this.collectList = result.data
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collect-page {
    .collect-list {
      // border-bottom: 1px solid #999;
      padding: 0 10px;
    }
  }
</style>
