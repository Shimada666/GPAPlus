<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mpType: 'app',
  onLaunch () {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function (res) {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function (res) {
      // 新的版本下载失败
    })
  },
  onShow () {
  },
  onHide () {
  },
  onShareAppMessage (res) {
    if (res.from === 'button') {
    }
    return {
      title: 'GPAPlus 矩阵计算器',
      path: '/view/index/index'
    }
  }
})
</script>

<style lang="scss">
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './asset/uni.css';
@import './asset/variable.scss';
page {
  background-color: #f4f5f6;
}
</style>
