<template>
  <view class="index">
    <rs-header :placeholder="false"></rs-header>
    <!-- 大图介绍/最热推荐 -->
    <view class="most-hot">
      <view class="most-hot__pics">
        <u--image :showLoading="true" :src="src" width="100%" height="80vh"></u--image>
      </view>
      <view class="most-hot__text-box">
        <view class="tags"> 热门新番 </view>
        <view class="name">凡人修仙传</view>
        <view class="introduct">已经出了 </view>
        <view class="opt">
          <u-button iconColor="#fff" text="立即播放" class="play global-btn custom-style" icon="play-right-fill">
          </u-button>
          <u-button text="图片详情" iconColor="#fff" class="xiangqing"></u-button>
          <u-button icon="star-fill" iconColor="#fff" class="like"></u-button>
        </view>
      </view>
    </view>
    <view class="video-list">
      <view class="list-head">
        <view class="title">热门新番</view>
        <view class="more">
          <u-button class="global-btn" text="更多" @click="goMine"></u-button>
        </view>
      </view>
      <view class="list-main">
        <block v-for="video in videoList">
          <rs-card :video="video" :key="video.video_id"></rs-card>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getVideoListApi
  } from '../../api/video.js'
  export default {
    data() {
      return {
        title: 'Hello',
        src: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.3PX0DeBzWBkzxO6g-KQi5QHaJ4?pid=ImgDet&rs=1',
        videoList: [],
        search: {
          keyword: '',
          pageSize: 6,
          pageNum: 1,
        },
      }
    },
    created() {
      this.initData()
    },
    methods: {
      goMine() {
        console.log('sgo')
        uni.navigateTo({
          url: '/pages/list/list',
        })
      },
      async initData() {
        const result = await getVideoListApi(this.search)
        this.videoList = result.data.data
      },
    },
  }
</script>

<style lang="scss">
  .index {
    padding-bottom: 200px;

    .most-hot {
      position: relative;
      padding-bottom: 50px;
      background-color: #12141a;

      &__text-box {
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 100%;
        padding-bottom: 10px;
        padding-left: 10px;
        color: #fff;
        background: linear-gradient(to top, #12141a, rgba(0, 0, 0, 0));

        .tags {
          text-align: center;
          background-color: $global-color;
          color: #fff;
          font-size: 14px;
          margin-top: -10px;
          padding: 2px 12px;
          border-radius: 4px;
          width: 60px;
        }

        .name {
          margin: 10px 0;
          font-weight: bolder;
          font-size: 20px;
        }

        .opt {
          display: flex;
          width: 60%;
          margin-top: 10px;

          .u-button.play {
            flex: 3;
          }

          .xiangqing,
          .like {
            background-color: #4e4f53;
            border-color: #4e4f53;
          }

          .xiangqing {
            flex: 2;
            margin: 0 10px;
            color: #fff;
          }

          .like {
            flex: 1;
          }
        }
      }
    }

    .video-list {
      padding: 0 10px;

      .list-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;

        .title {
          font-weight: bolder;
          font-size: 20px;
        }

        .more {
          width: 60px;

          .u-button {
            height: 30px;
          }
        }
      }

      .list-main {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
      }
    }
  }
</style>
