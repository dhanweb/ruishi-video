<template>
  <view class="search-list-page">
    <rs-header></rs-header>
    <view class="sea-ls-body">
      <navigator :url="'/pages/play/play?videoID='+ item.video_id" class="sea-ls-item" v-for="item in searchList">
        <view class="item-pic">
          <u--image radius="6px" :showLoading="true" :src="item.cover" width="124px" height="180px"></u--image>
          <view class="pic-modal"></view>
          <text class="sets">完结</text>
        </view>
        <view class="item-box">
          <view class="item-cotent">
            <view class="video-name">
              {{item.title}}
            </view>
            <view class="cate-list text-over ">
              <text class="cate" v-for="cate in item.category">
                {{cate.cate_name}}
              </text>
            </view>
            <view class="actor text-over ">
              <text class="title">主演：</text>
              <text class="people"> </text>
            </view>
            <view class="introduct">
              {{item.introduction}}
            </view>
          </view>
          <view class="opts">
            <view class="play">
              <u-button class="global-btn" text="播放正片"></u-button>
            </view>

            <button class="like">
              <u-icon name="star-fill"></u-icon>
            </button>
          </view>
        </view>
        <view></view>
      </navigator>
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
        src: 'https://cdn.uviewui.com/uview/album/1.jpg',
        search: {
          keyword: '',
          pageNum: 1,
          pageSize: 6
        },
        searchList: []
      }
    },
    onLoad(options) {
      this.search.keyword = options.keyword
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        const result = await getVideoListApi(this.search)
        const list = result.data.data
        if (list.length !== 0) {
          this.searchList = list
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-list-page {
    .sea-ls-body {
      padding: 0 10px;
      margin-top: 20px;

      .sea-ls-item {
        display: flex;
        margin-bottom: 20px;

        .item-pic {
          margin-right: 10px;
          position: relative;
          width: 124px;
          height: 180px;

          .pic-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;

            background-color: rgba(0, 0, 0, .3);
          }

          .sets {
            position: absolute;
            right: 4px;
            bottom: 4px;
            color: #ddd;
            font-size: 14px;
          }
        }

        .item-box {
          font-size: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .video-name {
            // font-weight: bold;
            font-size: 16px;
          }

          .text-over {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #bfc1c4;
            margin-bottom: 4px;
          }
        }

        .cate-list {
          .cate {
            margin-right: 8px;
          }
        }

        .actor {
          .title {
            color: #333;
          }

          .people {}
        }

        .introduct {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2; //需要展示的行数
          -webkit-box-orient: vertical;
          color: #575d6f;

        }

        .opts {
          display: flex;

          .play {}

          .like {
            margin-left: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 0 10px #575d6f;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
</style>
