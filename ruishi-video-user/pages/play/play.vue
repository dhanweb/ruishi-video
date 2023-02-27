<template>
  <view class="play-page" :class="{'hidder-body': popUpVisible}">
    <rs-header></rs-header>
    <view class="video-container">
      <video @timeupdate="videoTimeUpdateEvent($event)" id="rsVideo" :poster="partInfo.cover" :src="partInfo.url"
        :danmuList="danmuList" controls :duration="partInfo.duration" :enable-danmu="true"></video>
      <!-- <view class="uni-list uni-common-mt">
        <view class="uni-list-cell">
          <view>
            <view class="uni-label">弹幕内容</view>
          </view>
          <view class="uni-list-cell-db">
            <input v-model="danmuValue" class="uni-input" type="text" placeholder="在此处输入弹幕内容" />
          </view>
        </view>
      </view>
      <view class="uni-btn-v">
        <button @click="sendDanmu" class="page-body-button">发送弹幕</button>
      </view> -->
    </view>
    <view class="play-body">
      <view class="info-container bor-bottom">
        <view class="cover-box">
          <u--image radius="4px" :showLoading="true" :src="videoInfo.cover" width="80px" height="110px"></u--image>
        </view>
        <view class="intro-box">
          <view class="video-name">{{videoInfo.title}}</view>
          <view class="video-volume">
            <u-icon labelSize="14" name="play-circle" label="666万"></u-icon>
            <u-icon labelSize="14" name="heart" label="33.9万"></u-icon>
          </view>
          <view class="video-parts">连载中，每周二更新</view>
          <view class="video-introduction">
            <u-read-more color="#999" ref="uReadMore" :shadowStyle="shadowStyle" toggle showHeight="34" closeText=""
              openText="">
              {{videoInfo.introduction}}
            </u-read-more>
          </view>
          <view class="score-wrap">
            <view class="score">
              <text>9.2</text>分
            </view>
            <view class="nums">
              804人
            </view>
          </view>
        </view>
      </view>
      <view class="parts-container bor-bottom">
        <view class="parts-head container-head">
          <view class="head-title">选集</view>
          <view class="tips" @click="popUpVisible = true">
            更新至第{{partsList.length}}话<u-icon size="12" name="arrow-right"></u-icon>
          </view>
        </view>
        <view class="parts-box">
          <view class="parts-wrap">
            <view @click="choosePart(index)" class="parts-item" v-for="(item, index) in partsList"
              :class="{'active-part': index == currentPart}">
              <view class="part">
                第{{index+1}}话
              </view>
              <view class="title">
                {{item.description}}
              </view>
            </view>
          </view>
        </view>
        <u-popup :show="popUpVisible" @close="close" @open="open" :overlay='false'>
          <view class="pop-body" :style="{height: videoHeight}">
            <view class="pop-head">
              <text>选集</text>
              <u-icon name="close" @click="popUpVisible = false"></u-icon>
            </view>
            <view class="video-list">
              <view class="item" @click="choosePart(index)" :class="{'active-part': index == currentPart}"
                v-for="(item, index) in partsList">
                <view class="part">
                  第{{index+1}}话
                </view>
                <view class="title">
                  {{item.description}}
                </view>
              </view>
            </view>
          </view>
        </u-popup>
        <!-- <u-button @click="show = true">打开</u-button> -->
      </view>
      <view class="recommond-container bor-bottom">
        <view class="container-head">
          <view class="head-title">更多推荐</view>
        </view>
        <view class="recommond-box">
          <view class="recom-item" v-for="item in recommendList" @click="goPlay(item)">
            <view class="item-pics">
              <u--image radius="4px" :showLoading="true" :src="item.cover" width="120px" height="76px">
              </u--image>
            </view>
            <view class="item-info">
              <view class="name">{{item.title}}</view>
              <view class="infos">494.8万次观看 · 21.2万人追番</view>
            </view>
          </view>
        </view>
      </view>
      <view class="copyright">沪ICP备13002172号-3 bilibili.com © 2009-2020</view>
    </view>
  </view>
</template>

<script>
  //引入 hls与dplayer 用于解析播放视频 
  import Hls from 'hls.js'
  import Dplayer from 'dplayer'
  import {
    getVideoDetailApi,
    getVideoListApi,
    sentDanmuApi,
    getDanmuLstApi
  } from '../../api/video.js'
  export default {
    data() {
      return {
        dp: {},
        src: 'https://cdn.uviewui.com/uview/album/1.jpg',
        shadowStyle: {
          backgroundImage: "none",
          paddingTop: "0",
          marginTop: "20rpx"
        },
        popUpVisible: false,
        // 当前第几集
        currentPart: 0,
        videoHeight: '',
        danmuValue: '',
        videoInfo: {},
        partsList: [],
        partInfo: {},
        videoId: 0,
        partsId: 0,
        recommendList: [],
        playTime: 0,
        danmuList: [],
        danmuValue: ''

      }
    },
    onLoad(options) {
      this.videoId = options.videoID
    },
    onReady() {
      this.videoContext = uni.createVideoContext('rsVideo')
    },
    async created() {
      this.initData()
      this.getRecommend()
    },

    watch: {
      popUpVisible() {
        uni.pageScrollTo({
          scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0 
          duration: 100 // 滚动动画的时长
        })

      }
    },
    methods: {
      open() {
      },
      async initData() {
        const result = await getVideoDetailApi(this.videoId)
        this.videoInfo = result.data

      },
      async getDanmuList(id) {
        const result = await getDanmuLstApi(this.partInfo.part_id)
        this.danmuList = result.data
        console.log(' this.danmuList', this.danmuList);
      },
      async getRecommend() {
        const result = await getVideoListApi({
          keyword: '',
          pageNum: 1,
          pageSize: 5
        })
        this.recommendList = result.data.data
      },
      goPlay(item) {
        this.videoInfo = item
      },
      close() {
        this.show = false
        // console.log('close');
      },
      choosePart(index) {
        this.currentPart = index
        this.partInfo = this.partsList[index]
      },
      videoTimeUpdateEvent(e) { // 播放进度改变
        this.playTime = Math.round(Number(e.detail.currentTime))
      },
      sendDanmu: async function() {
        let danmu = {
          text: this.danmuValue,
          color: this.getRandomColor(),
          time: this.playTime
        }
        this.videoContext.sendDanmu(danmu);
        danmu.part_id = this.partInfo.part_id
        await sentDanmuApi(danmu)
        this.danmuValue = '';
      },
      videoErrorCallback: function(e) {
        uni.showModal({
          content: e.target.errMsg,
          showCancel: false
        })
      },
      getRandomColor: function() {
        const rgb = []
        for (let i = 0; i < 3; ++i) {
          let color = Math.floor(Math.random() * 256).toString(16)
          color = color.length == 1 ? '0' + color : color
          rgb.push(color)
        }
        return '#' + rgb.join('')
      },
    },
    watch: {
      videoInfo: {
        async handler(newVal) {
          this.partsList = newVal.parts
          this.partInfo = newVal.parts[0]
          this.currentPart = 0
          setTimeout(() => {
            this. getDanmuList()
            console.log('this.danmu', this.danmuList);
          }, 500)
        },
        // immediate:true
      }
    }
  }
</script>

<style scoped lang="scss">
  $active-color:#fb7299;

  .play-page {
    padding-bottom: 100px;

    .video-container {
      width: 100%;

      #rsVideo {
        width: 100%;
      }
    }

    &.hidder-body {
      height: 70vh;
      overflow: hidden;
    }

    .play-body {

      .bor-bottom {
        border-bottom: 1px solid #e7e7e7;
      }

      .info-container {
        display: flex;
        padding: 0 10px;
        margin-top: 30px;

        .cover-box {}

        .intro-box {
          position: relative;
          flex: 1;
          margin-left: 10px;


          .video {
            &-name {
              font-size: 16px;
            }

            &-volume {
              display: flex;
              color: #999;
              margin: 4px 0;

              .u-icon {
                margin-right: 4px;
              }
            }

            &-parts {
              font-size: 13px;
              color: #999;
              margin-bottom: 4px;
            }

            &-introduction {
              width: 90%;
              font-size: 13px;
              color: #999;
              margin-top: 10px;



              ::v-deep .u-read-more__content__inner {
                color: #999;
                font-size: 13px;
              }

              ::v-deep .u-read-more__toggle__icon {
                position: absolute;
                right: 0;
                bottom: 16px;
              }


            }
          }

          .score-wrap {
            position: absolute;
            right: 0;
            top: 0;

            .score {
              color: #ffa726;
              font-size: 12px;

              text {
                font-weight: bold;
                font-size: 18px;
              }
            }

            .nums {
              font-size: 13px;
              color: #c0c0c0;
            }
          }
        }


      }

      .container-head {
        height: 45px;
        line-height: 45px;
      }

      .head-title {
        font-weight: 700;
      }

      .parts-container {
        // padding: 10px 0;
        padding: 0 10px;
        padding-bottom: 30px;

        .parts-head {
          display: flex;
          justify-content: space-between;


          .tips {
            display: flex;
            align-items: center;
            color: #999;
            font-size: 12px;
          }
        }

        .parts-box {
          height: 50px;
          overflow-y: hidden;
        }


        .parts-wrap {
          overflow-x: scroll;
          display: flex;
          height: 60px;
        }

        .parts-item {
          flex-shrink: 0;
          width: 120px;
          border: 1px solid #ccc;
          border-radius: 6px;
          height: 46px;
          margin-right: 16px;
          box-sizing: border-box;
          padding: 4px 10px;

          .part {
            font-size: 14px;
            color: #212121;
          }

          .title {
            font-size: 12px;
            color: #505050;
          }
        }
      }

      .recommond-container {
        padding: 0 10px;
        padding-bottom: 10px;

        .recommond-box {
          .recom-item {
            display: flex;
            margin-bottom: 15px;

            .item-pics {}

            .item-info {
              margin-left: 10px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .name {
                font-size: 14px
              }

              .infos {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }

    }

    .pop-body {
      height: calc(100vh - 250px);
      box-sizing: border-box;
      padding: 10px;

      .pop-head {
        display: flex;
        justify-content: space-between;
      }

      .video-list {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;

        .item {
          padding: 8px;
          height: 60px;
          border: 1px solid #ccc;
          border-radius: 6px;

          .part {
            font-size: 14px;
          }

          .title {
            margin-top: 4px;
            font-size: 12px;
          }
        }
      }
    }

    .active-part {
      border-color: $active-color !important;

      .part,
      .title {
        color: $active-color !important;
      }
    }
  }
</style>
