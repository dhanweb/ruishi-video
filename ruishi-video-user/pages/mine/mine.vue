<template>
	<view class="mine-page">
		<rs-header></rs-header>
		<view class="mine-body">
			<u-cell-group>
				<u-cell title="未登录用户" size="large" isLink>
					<u-avatar slot="icon" :src="src" size="60"
						default-url="https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png">
					</u-avatar>
					<template slot="title" class="_abbr23">
						<view class="title">
							<navigator url="/pages/account/account" class="username" v-if="isLogin">dhannnnnnnnnnnn
							</navigator>
							<view class="username" v-else>未登录用户</view>
							<view class="tips"> {{isLogin?'rs-tv':'登录享受更多服务'}} </view>
						</view>
					</template>
					<template slot="value" v-if="!isLogin">
						<navigator url="/pages/login/login" class="goLogin">
							立即登录
						</navigator>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell title="播放记录" isLink url="/pages/record/record">
					<u-icon slot="icon" name="clock" color="#e40916"></u-icon>
					<text slot="value" class="value">记录看过的精彩</text>
				</u-cell>
				<u-cell title="点赞记录" isLink>
					<u-icon slot="icon" name="heart" color="#e40916"></u-icon>
				</u-cell>
				<u-cell title="收藏" isLink url="/pages/collect/collect">
					<u-icon slot="icon" name="star" color="#e40916"></u-icon>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell title="意见反馈" isLink :titleStyle="{color: '#909399'}">
					<u-icon slot="icon" name="info-circle" color="#909399"></u-icon>
				</u-cell>
				<u-cell title="关于我们" isLink :titleStyle="{color: '#909399'}">
					<u-icon slot="icon" name="question-circle" color="#909399"></u-icon>
				</u-cell>
			</u-cell-group>
			<u-cell-group v-if="isLogin">
				<u-cell title="退出登录" isLink :titleStyle="{color: '#909399'}">
					<u-icon slot="icon" name="backspace" color="#909399"></u-icon>
				</u-cell>
			</u-cell-group>
		</view>
		<view class="copyright">沪ICP备13002172号-3 bilibili.com © 2009-2020</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				src: 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png',
				isLogin: true,
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.mine-page {
		.mine-body {
			background-color: #f7f7f7;

			.u-cell-group {
				margin-bottom: 10px;
				background-color: #fff;

				.value {
					font-size: 14px;
					color: #949494;
				}

				.title {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 50px;
					margin-left: 4px;

					.username {}

					.tips {
						font-size: 12px;
						color: #999;
					}
				}

				.goLogin {
					color: $global-color;
				}
			}
		}


	}
</style>
