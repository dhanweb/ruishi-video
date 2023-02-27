<template>
	<navigator :url="'/pages/play/play?videoID='+video.video_id" class="rs-card" :class="{horizontal}">
		<!-- 封面 -->
		<view class="cover-box">
			<!-- 封面图片 -->
			<view class="cover-box__img">
				<u--image :showLoading="true" :src="video.cover" width="100%" :height="horizontal?'76px':'200px'">
				</u--image>
			</view>
			<!-- 显示在封面图片上的数据 -->
			<view class="cover-box__data">{{video.date}}</view>
		</view>
		<!-- 视频内容 -->
		<view class="content-box">
			<!-- 视频名称 -->
			<div class="content-box__name">{{video.name}}</div>
			<!-- 其他内容介绍 -->
			<div class="content-box__info">
				<slot>
					{{video.other}}
				</slot>
			</div>
		</view>
	</navigator>
</template>

<script>
	export default {
		name: "rs-card",
		props: {

			video: {
				type: Object,
				default: () => {
					return {
						id: 1,
						cover: 'https://cdn.uviewui.com/uview/album/1.jpg',
						date: '即将上映',
						name: '凡人修仙传'
					}
				}
			},
			horizontal: {
				type: Boolean,
				default: false
			}

		},
		data() {
			return {};
		}
	}
</script>

<style lang="scss" scoped>
	.rs-card {
		.cover-box {
			position: relative;
			border-radius: 10px;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				width: 100%;
				background-color: rgba(0, 0, 0, .2);
				z-index: 99;
			}

			&__img {}

			&__data {
				position: absolute;
				right: 8px;
				bottom: 8px;
				color: #fff;
				font-size: 14px
			}
		}

		.content-box {
			&__name {
				font-weight: 700;
				margin: 6px 0;
			}

			&__info {
				font-size: 14px;
				color: #999;
			}

		}

		&.horizontal {
			display: flex;
			margin: 15px 0;

			.cover-box {
				width: 120px;
				border-radius: 4px;
				
				&::before{
					opacity: 0;
				}

				&__data {
					font-size: 12px;
					color: #fff;
					bottom: 4px;
					right: 4px;
				}
			}

			.content-box {
				margin-left: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				&__name {
					color: #212121;
					font-weight: normal;
				}

			}
		}
	}
</style>
