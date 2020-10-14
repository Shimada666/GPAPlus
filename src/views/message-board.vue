<template>
  <view class="message-board uni-padding-wrap uni-common-mt">

    <form @submit="formSubmit" @reset="formReset">
      <view class="uni-form-item uni-column">
        <view class="title">请输入留言内容</view>
        <view class="uni-textarea" auto-height>
          <textarea />
        </view>
      </view>
      <view class="uni-btn-v">
        <button
          type="primary"
          form-type="submit">提交留言</button>
      </view>
    </form>
    <text>留言列表</text>
    <view class="uni-comment">
      <view class="uni-comment-list">
        <view class="uni-comment-body">
          <view class="uni-comment-top">
            <text>网友</text>
          </view>
          <view class="uni-comment-date">
            <text>08/10 08:12</text>
          </view>
          <view class="uni-comment-content">很酷的HBuilderX和uni-app，开发一次既能生成小程序，又能生成App</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CommonUtil } from '@/utils'

@Component
export default class MessageBoard extends Vue {
  onLoad () {
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
}
</script>

<style lang="scss">
  .uni-form-item .title {
    padding: 20rpx 0;
  }
</style>
