<template>
  <view class="play-page" :class="{ 'hidder-body': popUpVisible }">
    <rs-header></rs-header>
    <view class="video-container">
      <div class="abp show-content">
        <rs-barrage
          ref="barrageRef"
          :danmu="danmuList"
          :play="isPlay"
          :playTime="playTime"
        ></rs-barrage>
        <video
          ref="videoRef"
          :play-strategy="3"
          @timeupdate="videoTimeUpdateEvent($event)"
          id="rsVideo"
          :poster="partInfo.cover"
          :src="videoUrl"
          :danmuList="danmuList"
          :controls="controls"
          :duration="partInfo.duration"
          @play="playVideo"
          @pause="pausePlay"
          @error="videoErrorCallback"
          @loadedmetadata="loadeddataHandle"
        ></video>
      </div>

      <view class="danmu-body">
        <view class="danmu-box">
          <view class="danmu-content">
            <input
              v-model="danmuValue"
              class="uni-input"
              type="text"
              placeholder="发个友善的弹幕支持一下"
            />
          </view>
          <view class="danmu-btn">
            <button @click="sendDanmu" type="primary" :disabled="!disabled">发送</button>
          </view>
          <view class="like" @click="handleCollect">
            <u-icon
              :name="isCollect ? 'star-fill' : 'star'"
              color="#00aeec"
              size="28"
            ></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="play-body">
      <view class="info-container bor-bottom">
        <view class="cover-box">
          <u--image
            radius="4px"
            :showLoading="true"
            :src="videoInfo.cover"
            width="80px"
            height="110px"
          ></u--image>
        </view>
        <view class="intro-box">
          <view class="video-name">{{ videoInfo.title }}</view>
          <view class="video-volume">
            <u-icon labelSize="14" name="play-circle" label="666万"></u-icon>
            <u-icon labelSize="14" name="heart" label="33.9万"></u-icon>
          </view>
          <view class="video-parts">连载中，每周二更新</view>
          <view class="video-introduction">
            <u-read-more
              color="#999"
              ref="uReadMore"
              :shadowStyle="shadowStyle"
              toggle
              showHeight="34"
              closeText=""
              openText=""
            >
              {{ videoInfo.introduction }}
            </u-read-more>
          </view>
          <view class="score-wrap">
            <view class="score"> <text>9.2</text>分 </view>
            <view class="nums"> 804人 </view>
          </view>
        </view>
      </view>
      <view class="parts-container bor-bottom">
        <view class="parts-head container-head">
          <view class="head-title">选集</view>
          <view class="tips" @click="popUpVisible = true">
            更新至第{{ partsList.length }}话<u-icon size="12" name="arrow-right"></u-icon>
          </view>
        </view>
        <view class="parts-box">
          <view class="parts-wrap">
            <view
              @click="choosePart(index)"
              class="parts-item"
              v-for="(item, index) in partsList"
              :class="{ 'active-part': index == currentPart }"
            >
              <view class="part"> 第{{ index + 1 }}话 </view>
              <view class="title">
                {{ item.description }}
              </view>
            </view>
          </view>
        </view>
        <u-popup :show="popUpVisible" @close="close" :overlay="false">
          <view class="pop-body">
            <view class="pop-head">
              <text>选集</text>
              <u-icon name="close" @click="popUpVisible = false"></u-icon>
            </view>
            <view class="video-list">
              <view
                class="item"
                @click="choosePart(index)"
                :class="{ 'active-part': index == currentPart }"
                v-for="(item, index) in partsList"
              >
                <view class="part"> 第{{ index + 1 }}话 </view>
                <view class="title">
                  {{ item.description }}
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
              <u--image
                radius="4px"
                :showLoading="true"
                :src="item.cover"
                width="120px"
                height="76px"
              >
              </u--image>
            </view>
            <view class="item-info">
              <view class="name">{{ item.title }}</view>
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
import {
  getVideoDetailApi,
  getVideoListApi,
  sentDanmuApi,
  getDanmuLstApi,
  getPartInfoApi,
} from "../../api/video.js";
import { addRecordApi, getCollectApi, collectApi } from "../../api/user.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dp: {},
      src: "https://cdn.uviewui.com/uview/album/1.jpg",
      shadowStyle: {
        backgroundImage: "none",
        paddingTop: "0",
        marginTop: "20rpx",
      },
      popUpVisible: false,
      // 当前第几集
      currentPart: 0,
      videoInfo: {},
      partsList: [],
      partInfo: {},
      videoId: 0,
      partsId: 0,
      recommendList: [],
      playTime: 0,
      danmuList: [],
      danmuValue: "",
      controls: true,
      isPlay: false,
      disabled: false,
      initLoad: false,
      isCollect: false,
      // 是否第一次加载元数据
      firstLoad: false,
    };
  },
  onLoad(options) {
    this.videoId = options.videoID;
  },
  created() {
    this.initData();
    this.getRecommend();
  },
  mounted() {
    this.videoContext = uni.createVideoContext("rsVideo");
    console.log(
      "%c由于uniapp video组件问题，在PC端浏览器播放HLS视频可能会出问题，将会自动加载MP4格式的视频",
      `color:#e84118;`
    );
    console.log("%c视频使用了云点播的key防盗，一段时间将会过期", `color:#00a8ff;`);
  },
  computed: {
    ...mapGetters(["isLogin", "isPC"]),
    videoUrl() {
      const url = this.isPC ? this.partInfo.url2 : this.partInfo.url;
      return url;
    },
  },
  methods: {
    // 初始化数据
    async initData() {
      const result = await getVideoDetailApi(this.videoId);
      this.videoInfo = result.data;
      await this.getPartInfo(result.data.parts[0]);
      // 登录就获取收藏列表
      if (this.isLogin) {
        const { data: collect } = await getCollectApi();
        this.isCollect = collect.some((item) => item.video.video_id == this.videoId);
      }
    },
    // 获取弹幕
    async getDanmuList() {
      console.log("this.partInfo.part_id", this.partInfo.part_id);
      const result = await getDanmuLstApi(this.partInfo.part_id);
      this.danmuList = result.data;
    },
    async getPartInfo(part) {
      const { data } = await getPartInfoApi(part.part_id);
      this.partInfo = data;
      this.getDanmuList();
    },
    // 推荐视频
    async getRecommend() {
      const result = await getVideoListApi({
        keyword: "",
        pageNum: 1,
        pageSize: 5,
      });
      this.recommendList = result.data.data;
    },

    async playVideo() {
      if (!this.initLoad) {
        this.disabled = true;
      }

      console.log("playVideo");
      this.isPlay = true;
      if (this.isLogin) {
        await addRecordApi(this.videoId);
      }
    },
    pausePlay() {
      this.isPlay = false;
    },
    handleVideoClick() {
      if (this.controls) {
        this.controls = false;
      } else {
        this.controls = true;
      }
    },
    close() {
      this.show = false;
    },
    // 收藏
    async handleCollect() {
      await collectApi(this.videoId);
      this.isCollect = !this.isCollect;
    },
    choosePart(index) {
      this.currentPart = index;
      this.getPartInfo(this.partsList[index]);
    },
    videoTimeUpdateEvent(e) {
      // 播放进度改变
      this.playTime = Math.round(Number(e.detail.currentTime)) * 1000;
    },
    // 去播放页面
    goPlay(item) {
      uni.redirectTo({
        url: "/pages/play/play?videoID=" + item.video_id,
      });
    },
    sendDanmu: async function () {
      let danmu = {
        text: this.danmuValue,
        color: this.getRandomColor(),
        time: this.playTime / 1000,
        part_id: this.partInfo.part_id,
      };
      this.$refs.barrageRef.sendDanmu(danmu);
      console.log(this.$refs.barrageRef);
      await sentDanmuApi(danmu);
      this.danmuValue = "";
    },
    // 播放出错
    videoErrorCallback: function (e) {
      this.$store.commit("app/SET_PC_STATUS", true);
      console.log("ideoErrorCallback");
    },
    // 视频元数据能正常加载即触发
    loadeddataHandle() {
      // 第一次加载时，尝试将isPC设置成false，也就是尝试加载url的HLS格式
      // 如果依然失败，则会自动执行 this.cideoErrorCallback  加载mp4格式
      if (!this.firstLoad) {
        this.firstLoad = true;
        this.$store.commit("app/SET_PC_STATUS", false);
        console.log("视频元数据正常加载");
      }
    },
    getRandomColor: function () {
      const rgb = [];
      for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16);
        color = color.length == 1 ? "0" + color : color;
        rgb.push(color);
      }
      return "#" + rgb.join("");
    },
  },
  watch: {
    popUpVisible() {
      uni.pageScrollTo({
        scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0
        duration: 100, // 滚动动画的时长
      });
    },
    videoInfo: {
      async handler(newVal) {
        this.partsList = newVal.parts;
        this.getPartInfo(newVal.parts[0]);
        // this.partInfo = newVal.parts[0]
        this.currentPart = 0;
        // this.videoUrl = this.partInfo.url

        this.disabled = false;
        uni.pageScrollTo({
          scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0
          duration: 100, // 滚动动画的时长
        });
      },
    },
  },
};
</script>

<style scoped lang="scss">
$active-color: #fb7299;

.play-page {
  padding-bottom: 100px;

  .video-container {
    width: 100%;

    #rsVideo {
      width: 100%;
    }

    .show-content {
      width: 100%;
      height: 225px;
      position: relative;

      #comment-stage {
        height: calc(100% - 44px);
        z-index: 1;
      }
    }

    .danmu-box {
      display: flex;
      align-items: center;
      margin-top: 10px;
      padding: 0 10px;
      height: 34px;

      $radius: 12px;

      .danmu-content {
        flex: 1;
        background-color: #f1f2f3;
        height: 100%;
        border-top-left-radius: $radius;
        border-bottom-left-radius: $radius;

        input {
          height: 100%;
          font-size: 14px;
          padding-left: 1em;
        }
      }

      .danmu-btn {
        width: 64px;
        overflow: hidden;
        border-top-right-radius: $radius;
        border-bottom-right-radius: $radius;

        button {
          height: 34px;
          line-height: 34px;
          font-size: 14px;
          background-color: #00aeec;
        }
      }
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
      margin-top: 10px;

      .cover-box {
      }

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
      font-size: 16px;
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

          .item-pics {
          }

          .item-info {
            margin-left: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name {
              font-size: 14px;
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
