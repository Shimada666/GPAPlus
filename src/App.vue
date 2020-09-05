<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mpType: 'app',
  onLaunch () {
    console.log('App Launch')
  },
  onShow () {
    console.log('App Show')
  },
  onHide () {
    console.log('App Hide')
  }
})
</script>

<style lang="scss">
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './asset/uni.css';
@import './asset/variable.scss';
</style>
