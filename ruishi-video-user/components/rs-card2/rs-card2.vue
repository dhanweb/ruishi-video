<template>
  <navigator
    :url="`/pages/play/play?videoID=${video.video_id}`"
    class="rs-card"
  >
    <view class="img-box">
      <image :src="video.cover"></image>
      <text class="partsNum">{{ video.parts.length }}集</text>
    </view>
    <view class="content-box">
      <view class="content-box__title">{{ video.title }}</view>
      <view class="content-box__intro">{{ video.introduction }}</view>
    </view>
  </navigator>
</template>

<script>
export default {
  name: 'rs-card2',
  props: {
    video: {
      type: Object,
      default: () => {
        return {
          cover:
            'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/e3c25ada-f005-4be7-9e41-c8ebe250acf6.webp',
          count: 6,
          title: '凡人修仙传',
          introduction:
            '看机智的凡人小子韩立如何稳健发展、步步为营，战魔道、夺至宝、驰骋星海、快意恩仇，成为纵横三界的强者。他日仙界重相逢，一声道友尽沧桑。',
        }
      },
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
.rs-card {
  .img-box {
    width: 100%;
    height: calc(50vw / 1.8);
    position: relative;

    image {
      width: 100%;
      height: 100%;
    }

    .partsNum {
      position: absolute;
      right: 6px;
      bottom: 4px;
      font-size: 13px;
      color: #fff;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      // background-color: rgba(0, 0, 0, .1);
    }
  }

  .content-box {
    &__title {
      font-size: 14px;
    }

    &__intro {
      max-width: 180px;
      font-size: 12px;
      color: #999;
      margin-top: 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
