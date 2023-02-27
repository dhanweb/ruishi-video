<template>
	<view class="collect-page">
		<u-navbar title="收藏" :autoBack="true" safeAreaInsetTop placeholder bgColor="#f6f6f6" />
		<view class="collect-list">
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
	.collect-page {
		.collect-list {
			// border-bottom: 1px solid #999;
			padding: 0 10px;
		}
	}
</style>
