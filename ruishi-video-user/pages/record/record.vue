<template>
  <view class="record-page">
    <u-navbar title="播放记录" :autoBack="true" safeAreaInsetTop placeholder bgColor="#f6f6f6" />
    <view class="record-list">
      <template v-for="(record, index) in recordList">
        <view class="time" :key="index">
          {{record.title}}
        </view>
        <rs-card horizontal :video="video" v-for="video in record.videos" :key="video.video_id"></rs-card>
      </template>
    </view>
    <u-loadmore marginTop="30" :status="status" />
  </view>
</template>

<script>
  import {
    getHistoryApi
  } from '../../api/user'
  export default {
    data() {
      return {
        status: 'nomore',
        recordList: []
      }
    },
    created() {
      this.initData()
    },
    computed: {

    },
    methods: {
      async initData() {
        const {
          data
        } = await getHistoryApi()
        let obj = {
          today: {
            title: '今天',
            videos: [],
          },
          yesterday: {
            title: '昨天',
            videos: [],
          },
          ago: {
            title: '更久之前',
            videos: [],
          },



        }
        data.forEach(item => {
          const video = item.video
          if (this.today(item.time)) {
            obj.today.videos.push(video)
          } else if (this.yesterday(item.time)) {
            obj.yesterday.videos.push(video)
          } else {
            obj.ago.videos.push(video)
          }
        })
        console.log(obj);
        // const newArr = result.data.map(item => {
        //     const Date = new Date(item.time)
        //     const month = Date.getMonth()
        //     const day = Date.date()
        //     const time = month + day
        //     return {
        //       ...item,
        //       time: 
        //     }
        // })
        this.recordList = obj
      },
      today(time) {
        const compareDate = new Date(time)
        const currentDate = new Date()
        if (compareDate.getFullYear() === currentDate.getFullYear() &&
          compareDate.getMonth() === currentDate.getMonth() &&
          compareDate.getDate() === currentDate.getDate()) {
          return true
        } else {
          return false
        }

      },

      yesterday(time) {
        const compareDate = new Date(time)
        const currentDate = new Date()
        const yearterDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1)
        if (compareDate.getFullYear() === yearterDay.getFullYear() &&
          compareDate.getMonth() === yearterDay.getMonth() &&
          compareDate.getDate() === yearterDay.getDate()) {
          return true
        } else {
          return false
        }
      },
      formatDate(date) {
        const Date = new Date(date)
        const day = Date.getDate()
        console.log('day', day);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .record-page {
    .record-list {

      // border-bottom: 1px solid #999;
      .time {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #333;
      }

      padding: 0 10px;
    }
  }
</style>
