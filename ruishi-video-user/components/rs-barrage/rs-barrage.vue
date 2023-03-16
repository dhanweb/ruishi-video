<template>
  <view class="rs-barrage">
    <view class="bullet-wrap">
      <view class="barrage-item" :class="play?'play-barrage':'pause-barrage'" v-for="item in showingBullets"
        :key="item.danmu_id" :data-line="item.line+''">
        <text :style="{color: item.color}"> {{item.text}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  const getUUID = () => Math.random() + Math.random();

  export default {
    props: {
      danmu: {
        type: Array,
      },
      // 是否播放弹幕
      play: {
        type: Boolean,
        default: false
      },
      pause: {
        type: Boolean,
        default: false
      },
      // 当前播放时间
      playTime: {
        type: Number,
      }
    },
    data() {
      return {
        // 弹幕列表
        bullets: [],
        // 当前显示的弹幕集合
        showingBullets: [],
        // 最大显示行数
        lines: 6,
        // 当前行数
        currentLine: 1,
        defaulBullets: [],
        // 定时器
        timer: null
      }
    },
    mounted() {

    },
    methods: {
      showNextBullet() {
        // 先清除上一次的定时器
        clearInterval(this.timer)
        this.timer = null
        if (!this.bullets.length) {
          console.log('showNextBullet:stop',);
          return;
        }
        // 先确定弹道，跟上一个弹道错开即可
        for (let i = 0; i < this.bullets.length; i++) {
          const item = this.bullets[i]
          // console.log('item', item);
          console.log('item.time', item);
          // console.log('this.playTime', this.playTime);
          // 如果弹幕出现时间，大于当前视频播放时间，则显示该弹幕
          if (item.time * 1000 >= this.playTime && item.time * 1000 < (this.playTime + 500)) {
            console.log('item', item);
            // 设置出现的行数
            this.currentLine = (this.currentLine % this.lines) + 1;
            item.line = this.currentLine
            this.showingBullets.push(item)
            // 清除掉已经被显示的弹幕
            this.bullets.splice(i, 1)
          }
        }
        // this.index += 1
        // this.playTime += 1000
        // console.log('this.playTime', this.playTime);
        // console.log('showingBullets', this.showingBullets);
        this.timer = setInterval(this.showNextBullet, 1000);
      },
      stopBullet() {
        console.log('停止');
        clearInterval(this.timer)
        this.timer = null
      },
      sendDanmu(danmu) {
        this.showingBullets.push(danmu)
      }
    },
    watch: {
      danmu: {
        handler(val) {
          if (val) {
            let newArr = val
            for (let i = 0; i < newArr.length - 1; i++) {
              for (let j = 0; j < newArr.length - 1 - i; j++) {
                if (newArr[j].time > newArr[j + 1].time) {
                  let temp = newArr[j]
                  newArr[j] = newArr[j + 1]
                  newArr[j + 1] = temp
                }
              }

            }
            this.bullets = newArr
            this.defaulBullets = newArr
          }
        },
        immediate: true
      },
      play: {
        handler(val) {
          console.log('play', val);
          if (val) {
            this.showNextBullet();
          } else {
            this.stopBullet()
          }
        },
        immediate: true
      },
      // 如果新的播放时间小于旧的播放时间，表示用户进行了后退
      playTime(newVal, oldVal) {
        if (newVal < oldVal) {
          this.bullets = this.defaulBullets
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .rs-barrage {
    position: absolute;
    width: 100%;
    z-index: 999;
  }
  .bullet-wrap {
    height: 100%;
    background-color: #eee;
    position: relative;
  }

  .barrage-item {
    position: absolute;
    animation: rightToLeft 7s linear both;

    &[data-line="1"] {
      top: 20px;
    }

    &[data-line="2"] {
      top: 40px;
    }

    &[data-line="3"] {
      top: 60px;
    }

    &[data-line="4"] {
      top: 80px;
    }

    &[data-line="5"] {
      top: 100px;
    }

    &[data-line="6"] {
      top: 120px;
    }
  }

  @keyframes rightToLeft {
    0% {
      transform: translate(100vw);
    }

    100% {
      transform: translate(-100%);
    }
  }

  .play-barrage {
    animation-play-state: running;
  }

  .pause-barrage {
    animation-play-state: paused;
  }
</style>
