<template>
  <view class="index">
    <rs-header></rs-header>
    <u-skeleton
      :title="false"
      rows="1"
      rowsHeight="calc(100vw / 2.3)"
      :rowsWidth="['100%']"
      :loading="skeletonLoad"
    >
      <view class="swiper-body">
        <u-transition :show="!skeletonLoad">
          <u-swiper
            height="calc(100vw / 2.3)"
            @click="swiperClick"
            indicator
            circular
            showTitle
            indicatorMode="dot"
            :list="swiperList"
          >
          </u-swiper>
        </u-transition>
      </view>
    </u-skeleton>
    <view class="list-body">
      <view class="ske-body" v-for="item in 2" v-if="skeletonLoad">
        <u-skeleton
          :title="false"
          rows="1"
          rowsHeight="50px"
          :rowsWidth="['100%']"
          :loading="skeletonLoad"
        >
        </u-skeleton>
        <view class="item">
          <u-skeleton
            class="ske-item"
            v-for="item in 4"
            :title="false"
            rows="1"
            :rowsWidth="['100%']"
            rowsHeight="calc(50vw / 1.8)"
            :loading="skeletonLoad"
          >
          </u-skeleton>
        </view>
      </view>
      <view class="video-list" v-for="item in videoList" v-if="!skeletonLoad">
        <u-transition :show="!skeletonLoad">
          <view class="list-head">
            <view class="title">{{ item.cate_name }}</view>
            <view class="more">
              <u-button
                class="global-btn"
                text="更多"
                @click="goMore(item)"
              ></u-button>
            </view>
          </view>
          <view class="list-main">
            <block v-for="video in item.children">
              <rs-card2
                class="card"
                :video="video"
                :key="video.video_id"
              ></rs-card2>
            </block>
          </view>
        </u-transition>
      </view>
    </view>
  </view>
</template>

<script>
import { getVideoCateListApi } from '../../api/video.js'
import { getSwiperListApi } from '../../api/home.js'
import { getCateListAPI } from '../../api/category.js'
export default {
  data() {
    return {
      videoList: [],
      cateList: [],
      search: {
        keyword: '',
        pageSize: 4,
        pageNum: 1,
      },
      swiperList: [],
      skeletonLoad: true,
    }
  },
  onLoad() {
    this.$store.dispatch('user/getUserInfo')
    console.log('load')
  },
  created() {
    this.initData()
    this.setIndexVideo()
  },
  methods: {
    goMore(item) {
      console.log('sgo')
      uni.navigateTo({
        url: `/pages/list/list?pid=${item.pid}&cid=${item.cate_id}`,
      })
    },
    async initData() {
      const { data } = await getSwiperListApi()
      this.swiperList = data
      setTimeout(() => {
        this.skeletonLoad = false
      }, 300)
    },
    async setIndexVideo() {
      const { data } = await getCateListAPI()

      data[0].children.forEach(async (item, index) => {
        if (index === 3) return
        console.log(item)
        const { data: videoData } = await getVideoCateListApi({
          category: [item.cate_id],
        })
        console.log('videoData', videoData)
        const obj = {
          pid: data[0].cate_id,
          cate_id: item.cate_id,
          cate_name: item.cate_name,
          children: videoData,
        }
        this.videoList.push(obj)
      })
      // const catelist.push()
    },
    swiperClick(index) {
      uni.navigateTo({
        url:
          '/pages/play/play?videoID=' + this.swiperList[index].video.video_id,
      })
    },
  },
}
</script>

<style lang="scss">
.index {
  width: 100%;
  padding-bottom: 50px;

  .ske-body {
    margin-top: 10px;
    padding: 0 10px;
    box-sizing: border-box;

    .item {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      margin-top: 10px;
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
      // display: grid;
      // grid-template-columns: repeat(2, 1fr);
      // grid-gap: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .card {
        width: 49%;
        flex-shrink: 1;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
