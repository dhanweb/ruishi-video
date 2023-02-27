<template>
	<view class="record-page">
		<u-navbar title="播放记录" :autoBack="true" safeAreaInsetTop placeholder bgColor="#f6f6f6" />
		<view class="record-list">
			<view class="time">
				今天
			</view>
			<template v-for="item in 5">
				<rs-card horizontal></rs-card>
			</template>
		</view>
		<u-loadmore marginTop="30" :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'nomore'
			}
		},
		methods: {

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
