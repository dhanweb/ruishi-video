<template>
	<view class="list-container">
		<rs-header></rs-header>
		<view class="category">
			<view class="groups" v-for="cate1 in category" :key="cate1.cate_id">
				<view class="group-name">{{cate1.cate_name}}</view>
				<div class="scrollbar-box">
					<view class="group-list">
						<view class="item" :class="{ current: currentCate === 0 }">
							全部
						</view>
						<view :class="{ current: currentCate === cate2.cate_id }" class="item"
							v-for="cate2 in cate1.children" :key="cate2.cate_id">
							{{cate2.cate_name}}
						</view>
					</view>
				</div>
			</view>
		</view>
		<view class="sort-box">
			<view @click="currentSort(item.id)" :class="{ current: item.id == sortValue }" class="sort-value"
				v-for="item in sortList">
				{{ item.label }}
			</view>
		</view>
		<view class="video-list">
			<rs-card :video="video" :videoID="1" class="card" v-for="video in videoList" :key="video.video_id"></rs-card>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {getVideoListApi} from '../../api/video.js'
	export default {
		data() {
			return {
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
					pageSize: 5
				},
				videoList: [],
				total: 0,
				totalPage: 0
			}
		},
		computed: {
			...mapGetters(['category'])
		},
		created() {
			this.initData()
		},
		methods: {
			async initData() {
				const result  = await getVideoListApi(this.search)
				console.log(result);
				this.videoList = result.data.data
			},
			currentSort(id) {
				this.sortValue = id
			},
		},
	}
</script>

<style lang="scss" scoped>
	.list-container {
		background-color: $page-color;
		color: #666;

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
			padding: 0 10px;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 10px;
		}
	}
</style>
