<script>
	export default {
		onLaunch: function() {
			this.$store.dispatch('user/getUserInfo')
			this.$store.dispatch('category/getCateList')
			console.log('App Launch')
		},            
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  
	view,
	text {
    font-size: 16px;
	}
  navigator {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    background-color: rgba(0,0,0,0)!important;
  }

	.global-btn {
		background-color: $global-color !important;
		border-color: $global-color !important;
		color: #fff !important;
	}

	.copyright {
		text-align: center;
		color: #999;
		font-size: 12px;
		margin-top: 20px;
	}
</style>
