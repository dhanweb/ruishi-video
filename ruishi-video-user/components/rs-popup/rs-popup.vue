<template>
  <view class="popup">
    <view>
      <u-popup :show="show" @close="close" @open="open" mode="left">
        <view>
          <text>出淤泥而不染，濯清涟而不妖</text>
        </view>
      </u-popup>
      <!-- <u-button @click="show = true">打开</u-button> -->
    </view>
  </view>
</template>

<script>
export default {
  name: 'popup',
  props: ['show'],
  data() {
    return {}
  },
  methods: {
    open() {
      // console.log('open');
    },
    close() {
      // this.show = false
      // console.log('close');
    },
  },
}
</script>

<style lang="scss" scoped></style>
