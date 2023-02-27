<template>
	<!-- 头部 -->
	<view class="rs-header" :class="{ placeholder }">
		<view class="rs-header-box">
			<navigator url="/" class="logo-view">锐视TV</navigator>
			<view class="head-opt">
				<u-icon @click="goSearch" name="search" size="34px" :color="color"></u-icon>
				<u-icon name="clock" size="24px" :color="color"></u-icon>
				<u-icon v-if="menu" @click="open" name="list" size="30px" :color="color"></u-icon>
			</view>
		</view>
		<u-popup :show="show" mode="left" @close="close" @open="open" bgColor="#23252b">
			<view class="popup">
				<view class="popup-header">
					<view class="no-login" v-if="!isLogin">
						<text>登录后精彩剧集随时追</text>
						<view class="login-btn">
							<u-button class="global-btn" iconColor="#fff" text="登录" @click="goLogin"></u-button>
						</view>
					</view>
					<view class="logined" v-else>
						<u--image shape="circle" :showLoading="true" :src="user.avatar" width="80px" height="80px"
							@click="goMine"></u--image>
						<view class="username" @click="goMine">{{user.username}}</view>
						<view class="logut" @click="handleLogout">
							<u-icon name="backspace" color="#fff" size="22"></u-icon>
							<text> 退出</text>
						</view>
					</view>
				</view>
				<view class="popup-list">
					<template v-for="cate in category">
						<view class="item" v-for="cate2 in cate.children" :key="cate2.cate_id">
							<navigator :url="`/pages/list/list?cate_id=${cate2.cate_id}`">
								{{cate2.cate_name}}
							</navigator>
						</view>
					</template>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'rs-header',
		props: {
			menu: {
				type: Boolean,
				default: true,
			},
			placeholder: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				show: false,
				isLogin: false,
				src: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.3PX0DeBzWBkzxO6g-KQi5QHaJ4?pid=ImgDet&rs=1',
			}
		},
		methods: {
			open() {
				this.show = true
			},
			close() {
				this.show = false
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
				})
			},
			handleLogout() {
				this.$store.dispatch('user/logout')
			},
			goMine() {
				uni.navigateTo({
					url: '/pages/mine/mine'
				})
			}
		},

		computed: {
			...mapGetters(['token', 'user', 'category']),
			color() {
				if (this.placeholder) {
					return '#333';
				} else {
					return '#fff';
				}

			}
		},
		watch: {
			"$route": {
				handler(val) {
					this.show = false
					console.log('this.show', this.show);
				}
			},
			"token": {
				handler(val) {
					if (val) {
						this.isLogin = true
					} else {
						this.isLogin = false
					}
				},
				immediate: true
			}

		}
	}
</script>

<style lang="scss" scoped>
	.rs-header {
		width: 100%;
		color: #fff;

		.rs-header-box {
			display: flex;
			justify-content: space-between;
			padding: 0 10px;
			width: 100%;
			height: 50px;
			line-height: 50px;
			font-size: 20px;
			background-color: rgba(87, 81, 80, 0.5);
			position: fixed;
			z-index: 999;
			box-sizing: border-box;

			.head-opt {
				display: flex;

				.u-icon {
					margin-left: 10px;
					color: #fff;
				}
			}
		}

		.popup {
			width: 240px;

			&-header {
				margin-top: 50px;
				color: #fff;

				text {
					color: $text-color;
				}

				.no-login {
					text-align: center;
				}

				.logined {
					position: relative;
					padding: 0 10px;

					.username {
						padding-left: 6px;
						margin-top: 10px;
					}

					.logut {
						display: flex;
						position: absolute;
						right: 12px;
						top: 0;
						background-color: #111215;
						padding: 4px 8px;
						font-size: 14px;
						border-radius: 4px;
						cursor: pointer;

						.u-icon {
							// vertical-align: -8px;
							margin-top: -1px;
						}
					}
				}

				.login-btn {
					width: 100px;
					margin: 0 auto;
					border-radius: 6px;
					overflow: hidden;
					margin-top: 10px;
				}
			}

			&-list {
				margin-top: 20px;
				padding-left: 10px;

				.item {
					font-size: 18px;
					width: 100%;
					padding: 10px;
					box-sizing: border-box;
					cursor: pointer;
					color: #fff;

					&:hover {
						color: $global-color;
					}
				}
			}
		}

		&.placeholder {
			height: 50px;
			color: $global-color;

			.rs-header-box {
				background-color: #fff;

				.head-opt {
					.u-icon {
						color: #333;
					}
				}
			}
		}
	}
</style>
