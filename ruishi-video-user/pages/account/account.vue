<template>
	<view class="account-page">
		<!-- <rs-header></rs-header> -->
		<u-navbar title="个人中心" :autoBack="true" safeAreaInsetTop placeholder bgColor="#f6f6f6" />
		<view class="account-body">
			<u-cell-group>
				<u-cell size="large" title="头像" isLink>
					<u-avatar slot="value" :src="src" size="60"
						default-url="https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png">
					</u-avatar>
				</u-cell>
				<u-cell title="昵称" value="dhannnnnnnnnn" isLink></u-cell>
				<u-cell title="修改密码" isLink></u-cell>
			</u-cell-group>
			<!-- <u-gap height="5" bgColor="#f7f7f7"></u-gap> -->
			<u-cell-group >
				<u-cell title="登录时间" value="2022-10-29 22:39:44" ></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
