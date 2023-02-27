<template>
  <view class="search-page">
    <u-navbar title="搜索" :autoBack="true" :placeholder="true">
    </u-navbar>
    <view class="search-body">
      <u-search @search="goSeachList" @custom="goSeachList" placeholder="日照香炉生紫烟" v-model="keyword" :clearabled="true" :action-style="actionStyle" shape="square" />
      <view class="search-history">
        <view class="title">搜索历史</view>
        <view class="his-list">
          <u-tag v-for="item in 6" :key="item" text="标签" closable color="#444" bgColor="#f5f6f7" borderColor="#f5f6f7"
            @click="goSeachList" @close="closeTag"></u-tag>
        </view>
      </view>
      <view class="hot-search">
        <view class="title">热门搜索</view>
        <view class="hot-list">
          <view class="item" v-for="item in 4">
            <text class="num">{{item}}</text>
            <text class="content"> 海贼王 </text>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        actionStyle: {
          backgroundColor: '#e50916',
          color: '#fff',
          width: '60px',
          height: '30px',
          lineHeight: '30px',
          textAlign: 'center',
        },
        keyword: '',
        historyList: []
      }
    },
    mounted() {
      this.getHistory()
    },
    methods: {
      goSeachList(index) {
        console.log('goSeachList');
        this.setHistory()
        uni.navigateTo({
          url: '/pages/search-list/search-list?keyword=' + this.keyword
        })
      },
      closeTag() {
        console.log('closeTag');
      },
      getHistory() {
        const existHistory = uni.getStorageSync('rs-tv-history')
        if (existHistory) {
          this.historyList = existHistory
        }
      },
      setHistory() {
        this.historyList.unshift(this.keyword)
        uni.setStorageSync('rs-tv-history', this.historyList)
      },
      clearHistory(index) {
        this.historyList.splice(index, 1)
        uni.setStorageSync('rs-tv-history', this.historyList)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .search-page {
    .search-body {
      padding: 0 10px;

      .title {
        color: #999;
        margin: 20px 0;
        font-size: 14px
      }

      .search-history {
        .his-list {
          display: flex;
          flex-wrap: wrap;
        }
      }

      .hot-search {
        .hot-list {
          .item {
            margin-bottom: 20px;

            .num {
              margin-right: 10px;
              font-weight: bold;
            }
          }

          .item:nth-child(1) {
            .num {
              color: #ff7340;
            }
          }

          .item:nth-child(2) {
            .num {
              color: #0aa775;
            }
          }

          .item:nth-child(3) {
            .num {
              color: #f08a9f;
            }
          }

        }
      }

    }


  }
</style>
