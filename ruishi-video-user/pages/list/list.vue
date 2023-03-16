<template>
  <view class="list-container">
    <rs-header></rs-header>
    <view class="category">
      <view class="groups" v-for="cate1 in category" :key="cate1.cate_id">
        <view class="group-name">{{cate1.cate_name}}</view>
        <div class="scrollbar-box">
          <view class="group-list">
            <view class="item" @click="removeCurrent(cate1.cate_id)"
              :class="{ current: pushCate[cate1.cate_id] == null || !pushCate[cate1.cate_id] }">
              全部
            </view>
            <view @click="handleCate(cate1.cate_id, cate2.cate_id)"
              :class="{ current: pushCate[cate1.cate_id] == cate2.cate_id }" class="item"
              v-for="cate2 in cate1.children" :key="cate2.cate_id">
              {{cate2.cate_name}}
            </view>
          </view>
        </div>
      </view>
    </view>
    <!-- <view class="sort-box">
      <view :class="{ current: item.id == sortValue }" class="sort-value" v-for="item in sortList">
        <text @click="currentSort(item.id)"> {{ item.label }}</text>
      </view>
    </view> -->
    <view class="video-list">
      <rs-card :video="video" :videoID="1" class="card" v-for="video in videoList" :key="video.video_id"></rs-card>
    </view>
    <u-empty v-if="videoList.length === 0" mode="search" text="没有相关内容"></u-empty>
    <view class="loading" v-if="showLoading">
      <u-loading-icon></u-loading-icon>
    </view>
    <u-loadmore :status="status" />
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getVideoListApi,
    getVideoCateListApi
  } from '../../api/video.js'
  export default {
    data() {
      return {
        status: 'loadmore',
        sortList: [{
            id: 0,
            label: '按最新',
          },
          {
            id: 1,
            label: '按最热',
          },
          {
            id: 2,
            label: '按评分',
          },
        ],
        sortValue: 0,
        currentCate: 0,
        search: {
          keyword: '',
          pageNum: 1,
          pageSize: 6
        },
        videoList: [],
        total: 0,
        totalPage: 0,
        showLoading: true,
        // 选择的分类数组
        pushCate: {

        }
      }
    },
    computed: {
      ...mapGetters(['category']),
    },
    onLoad(options) {
      if(options.pid) {
        this.pushCate = {
          [options.pid]: options.cid
        }
      }
    },
    created() {
      this.initData()
    },
    onReachBottom() {
      console.log('触底了');
      this.search.pageNum++
      this.initData()
    },
    methods: {
      async initData() {

        if (this.status === 'nomore') {
          return
        }
        this.status = 'loading'
        const result = await getVideoListApi(this.search)
        console.log(result);
        const data = result.data.data
        this.videoList.push(...data)
        setTimeout(() => {
          this.showLoading = false
        }, 200)
        if (data.length === 0) {
          this.status = 'nomore'
        }
      },
      currentSort(id) {
        this.showLoading = true
        this.sortValue = id
        this.initData()
      },
      // 将选中的分类数据放到对象中，因为有三种不同的分类
      async handleCate(c1, c2) {
        this.showLoading = true
        // { 一级id1: 二级id11， 一级id2：二级id22  }
        this.$set(this.pushCate, c1 + '', c2)
        this.pushCate[c1] = c2

      },
      removeCurrent(c1) {
        this.$set(this.pushCate, c1 + '', null)
        // delete this.pushCate[c1]
      }
    },
    watch: {
      pushCate: {
        async handler(val) {
          this.videoList = []
          console.log('remove', val);
          // 发起请求 对象转数组
          const newArr = Object.values(this.pushCate)
          const category = newArr.filter(item => item !== null)
          console.log('category', category);
          if (category.length === 0) {
            this.initData()
            return false
          }
          const result = await getVideoCateListApi({
            category
          })
          this.videoList = result.data
          this.showLoading = false
          console.log('result', result);
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-container {
    background-color: $page-color;
    color: #666;
    font-size: 14px;
    min-height: 100vh;

    .category {
      margin-top: 10px;
      padding: 0 20px;

      .current {
        background-color: #fff;
        color: #e50916;
        border-radius: 6px;
      }

      .groups {
        display: flex;
        align-items: center;
        height: 44px;

        .group-name {
          width: 50px;
          color: $text-color;
        }

        .scrollbar-box {
          flex: 1;
          overflow-y: hidden;
          height: 30px;

          .group-list {
            display: flex;
            overflow-x: scroll;
            width: 100%;
            height: 40px;

            .item {
              box-sizing: border-box;
              padding: 4px 7px;
              margin-right: 10px;
              flex-shrink: 0;
            }
          }
        }
      }
    }

    .sort-box {
      display: flex;
      justify-content: space-around;
      margin: 10px 0 20px;

      .sort-value {
        text-align: center;
        padding: 8px 0;

        &.current {
          position: relative;

          &::after {
            content: '';
            width: 20px;
            height: 3px;
            position: absolute;
            bottom: 0;
            left: 14px;
            background-color: $global-color;
          }
        }
      }
    }

    .video-list {
      margin-top: 20px;
      padding: 0 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      min-height: calc(100vh - 180px);
    }

    .loading {
      position: fixed;
      top: 200px;
      width: 100%;
      height: calc(100vh - 250px);
      z-index: 100;
      background-color: #f5f6f7;
    }
  }
</style>
