<template>
  <view class="gpa-plus uni-padding-wrap uni-common-mt">
    <view class="gpa-plus__button-help">
      <text @click="showToggle">点击显示/隐藏帮助</text>
      <!--<text style="margin-left: 20px; color: #0a98d5;" @click="routerToMessageBoard">留言板</text>-->
    </view>
    <view v-if="showTextSwitch" class="help"><text>{{ contentHelp }}</text></view>
    <view class="gpa-plus__matrix-display uni-flex uni-row">
      <view>矩阵A<view class="matrix"><text>{{ prettyMatrixA }}</text></view></view>
      <view>矩阵B<view class="matrix"><text>{{ prettyMatrixB }}</text></view></view>
      <view>结果<view class="matrix"><text>{{ prettyMatrixResult }}</text></view></view>
    </view>
    <view class="gpa-plus__tmp-row">
      /: {{ tmpRow }}
    </view>
    <view class="uni-flex uni-row">
      <view class="gpa-plus__input-number_block uni-flex">
        <button @click="clickNumber(1)" class="gpa-plus__number">1</button>
        <button @click="clickNumber(2)" class="gpa-plus__number">2</button>
        <button @click="clickNumber(3)" class="gpa-plus__number">3</button>
        <button @click="clickNumber(4)" class="gpa-plus__number">4</button>
        <button @click="clickNumber(5)" class="gpa-plus__number">5</button>
        <button @click="clickNumber(6)" class="gpa-plus__number">6</button>
        <button @click="clickNumber(7)" class="gpa-plus__number">7</button>
        <button @click="clickNumber(8)" class="gpa-plus__number">8</button>
        <button @click="clickNumber(9)" class="gpa-plus__number">9</button>
        <button @click="clickNumber('.')" class="gpa-plus__number">.</button>
        <button @click="clickNumber(0)" class="gpa-plus__number">0</button>
        <button @click="clickNumber(',')" class="gpa-plus__number gpa-plus__number--small-text">分隔</button>
        <button @click="clickNumber('-')" class="gpa-plus__number">-</button>
        <button @click="insertOneRow('A')" class="gpa-plus__number gpa-plus__number--small-text">插入A</button>
        <button @click="insertOneRow('B')" class="gpa-plus__number gpa-plus__number--small-text">插入B</button>
        <!--<view class="insert-area uni-flex uni-row">-->
        <!--  <button @click="insertOneRow('A')" class="insert-btn">插入A</button>-->
        <!--  <button @click="insertOneRow('B')" class="insert-btn">插入B</button>-->
        <!--</view>-->
      </view>
      <view class="gpa-plus__right-area uni-flex">
        <button @click="backspace" class="gpa-plus__right-area-button">退格</button>
        <button @click="clearTmpRow" class="gpa-plus__right-area-button">清空输入</button>
        <button @click="removeMatrixLatestLine('A')" class="gpa-plus__right-area-button">删除A末行</button>
        <button @click="removeMatrixLatestLine('B')" class="gpa-plus__right-area-button">删除B末行</button>
        <button @click="clearMatrix('A')" class="gpa-plus__right-area-button">清空A</button>
        <button @click="clearMatrix('B')" class="gpa-plus__right-area-button">清空B</button>
        <button @click="undo('A')" class="gpa-plus__right-area-button">撤销A</button>
        <button @click="undo('B')" class="gpa-plus__right-area-button">撤销B</button>
        <button @click="resultToMatrix('A')" class="gpa-plus__right-area-button">结果设为A</button>
        <button @click="resultToMatrix('B')" class="gpa-plus__right-area-button">结果设为B</button>
      </view>
    </view>
    <view class="gpa-plus__bottom-area uni-flex">
      <button @click="matrixADet" class="gpa-plus__bottom-area-button">求值(A)</button>
      <button @click="matrixAInv" class="gpa-plus__bottom-area-button">求逆(A)</button>
      <button @click="matrixATrace" class="gpa-plus__bottom-area-button">求迹(A)</button>
      <button @click="matrixTranspose('A')" class="gpa-plus__bottom-area-button">转置矩阵(A)</button>
      <button @click="matrixTranspose('B')" class="gpa-plus__bottom-area-button">转置矩阵(B)</button>
      <button @click="matrixMultiply" class="gpa-plus__bottom-area-button">矩阵相乘</button>
      <button @click="matrixAdd" class="gpa-plus__bottom-area-button">矩阵相加</button>
      <button @click="matrixCross" class="gpa-plus__bottom-area-button">向量叉乘</button>
      <button @click="matrixDot" class="gpa-plus__bottom-area-button">向量点乘</button>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { create, all } from 'mathjs'
import { CommonUtil } from '@/utils'

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 12,
  predictable: false
}
const math = create(all, config)

@Component
export default class GPAPlus extends Vue {
  tmpRow = ''
  matrixAHistoryStack: string[] = []
  matrixAStr = ''
  matrixBHistoryStack: string[] = []
  matrixBStr = ''
  matrixResult = ''
  showTextSwitch = false
  contentHelp = '线代计算器，时隔两年堂堂更新！全新界面，全新体验。\n' +
      '\n' +
      '每次输入一行，相邻数据使用分隔符分隔。\n' +
      '矩阵相乘的输出为 A x B。\n' +
      '为方便，叉乘、点乘的输入AB均为一行的行向量。\n' +
      '\n' +
      '发现任何bug或有任何需求可以到 (https://github.com/Shimada666/GPAPlus) 提交issue，或发邮件至lune_z@foxmail.com。\n' +
      '玩得愉快！\n '
  static SYMBOL_LIST: any[] = [',', '-', '.']

  onLoad () {
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }

  routerToMessageBoard () {
    uni.navigateTo({
      url: '/views/message-board'
    })
  }

  showToggle () {
    this.showTextSwitch = !this.showTextSwitch
  }

  clickNumber (num: string | number) {
    const target = this.tmpRow + num
    if (GPAPlus.SYMBOL_LIST.includes(num) && num !== '-') {
      if (!this.tmpRow) {
        this.showDefaultToast('您还没有输入内容')
        return
      }
    }
    if (!this.isLegalRow(target)) {
      return
    }
    this.tmpRow += num
  }

  insertOneRow (matrix: 'A' | 'B') {
    if (!this.tmpRow) {
      return
    }
    if (this.tmpRowLatestChar === ',' || this.tmpRowLatestChar === '-') {
      this.tmpRow = this.tmpRow.substring(0, this.tmpRow.length - 1)
    }
    const tmpRowLength = this.tmpRow.split(',').length
    const newRow = this.tmpRow.split(',').map(x => Number(x)).join(',') + '\n'
    if (matrix === 'A') {
      if (this.matrixA[0] && this.matrixA[0].length !== 0 && this.matrixA[0].length !== tmpRowLength) {
        this.showDefaultToast('与矩阵A已插入形状不一致')
        return
      }
      this.matrixAHistoryStack.push(this.matrixAStr)
      this.matrixAStr += newRow
    } else {
      if (this.matrixB[0] && this.matrixB[0].length !== 0 && this.matrixB[0].length !== tmpRowLength) {
        this.showDefaultToast('与矩阵B已插入形状不一致')
        return
      }
      this.matrixBHistoryStack.push(this.matrixBStr)
      this.matrixBStr += newRow
    }
    this.tmpRow = ''
  }

  backspace () {
    const row = this.tmpRow.trim()
    if (!row) {
      return
    }
    this.tmpRow = row.substring(0, row.length - 1)
  }

  clearTmpRow () {
    this.tmpRow = ''
  }

  removeMatrixLatestLine (matrix: 'A' | 'B') {
    if (matrix === 'A') {
      this.matrixAHistoryStack.push(this.matrixAStr)
      if (this.matrixAStr.trim().split('\n').length <= 1) {
        this.clearOneMatrix(matrix)
      } else {
        this.matrixAStr = this.matrixAStr.trim().split('\n').slice(0, -1).join('\n') + '\n'
        this.matrixAHistoryStack.push(this.matrixAStr)
      }
    } else {
      this.matrixBHistoryStack.push(this.matrixBStr)
      if (this.matrixBStr.trim().split('\n').length <= 1) {
        this.clearOneMatrix(matrix)
      } else {
        this.matrixBStr = this.matrixBStr.trim().split('\n').slice(0, -1).join('\n') + '\n'
        this.matrixBHistoryStack.push(this.matrixBStr)
      }
    }
  }

  clearMatrix (matrix: 'A' | 'B') {
    if (matrix === 'A') {
      this.matrixAHistoryStack.push(this.matrixAStr)
    } else {
      this.matrixBHistoryStack.push(this.matrixBStr)
    }
    this.clearOneMatrix(matrix)
  }

  private clearOneMatrix (matrix: 'A' | 'B') {
    if (matrix === 'A') {
      this.matrixAStr = ''
    } else {
      this.matrixBStr = ''
    }
  }

  undo (matrix: 'A' | 'B') {
    if (matrix === 'A') {
      const prevOp = this.matrixAHistoryStack.pop()
      if (prevOp) {
        this.matrixAStr = prevOp
      } else {
        this.matrixAStr = ''
      }
    } else {
      const prevOp = this.matrixBHistoryStack.pop()
      if (prevOp) {
        this.matrixBStr = prevOp
      } else {
        this.matrixBStr = ''
      }
    }
  }

  resultToMatrix (matrix: 'A' | 'B') {
    if (!this.matrixResult) {
      return
    }
    if (matrix === 'A') {
      this.matrixAHistoryStack.push(this.matrixAStr)
      this.matrixAStr = this.matrixResult + '\n'
    } else {
      this.matrixBHistoryStack.push(this.matrixBStr)
      this.matrixBStr = this.matrixResult + '\n'
    }
  }

  matrixADet () {
    try {
      this.matrixResult = this.formatMatrixItem(math.det!(this.matrixA)) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixAInv () {
    try {
      this.matrixResult = this.formatMatrix(math.inv!(this.matrixA))
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixATrace () {
    try {
      this.matrixResult = this.formatMatrixItem(math.trace!(this.matrixA)) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixTranspose (matrix: 'A' | 'B') {
    try {
      if (matrix === 'A') {
        this.matrixResult = this.formatMatrix(math.transpose!(this.matrixA))
      } else {
        this.matrixResult = this.formatMatrix(math.transpose!(this.matrixB))
      }
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixMultiply () {
    try {
      this.matrixResult = this.formatMatrix(math.multiply!(this.matrixA, this.matrixB))
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixAdd () {
    try {
      this.matrixResult = this.formatMatrix((math.add!(this.matrixA, this.matrixB) as number[][]))
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixCross () {
    try {
      this.matrixResult = this.formatMatrix((math.cross!(this.matrixA, this.matrixB) as number[][]))
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixDot () {
    try {
      this.matrixResult = this.formatMatrixItem(math.dot!(math.squeeze!(this.matrixA), math.squeeze!(this.matrixB))) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  get prettyMatrixA () {
    return this.matrixAStr.replace(/,/g, '\t')
  }

  get prettyMatrixB () {
    return this.matrixBStr.replace(/,/g, '\t')
  }

  get prettyMatrixResult () {
    return this.matrixResult.replace(/,/g, '\t')
  }

  get matrixA () {
    if (!this.matrixAStr.trim()) {
      return [[]]
    }
    const tmp = this.matrixAStr.trim().split('\n')
    return tmp.map(row => row.split(',').map(item => Number(item)))
  }

  get matrixB () {
    if (!this.matrixBStr.trim()) {
      return [[]]
    }
    const tmp = this.matrixBStr.trim().split('\n')
    return tmp.map(row => row.split(',').map(item => Number(item)))
  }

  get tmpRowLatestChar () {
    return this.tmpRow.charAt(this.tmpRow.length - 1)
  }

  rowLatestChar (str: string) {
    return str.charAt(str.length - 1)
  }

  isLegalRow (str: string) {
    let tmpRow = str.trim()
    if (this.rowLatestChar(str) === ',') {
      tmpRow = str.substr(0, str.length - 1)
    }
    const numList = tmpRow.split(',')
    for (const num of numList) {
      if (!num) {
        return false
      }
      if (num === '.') {
        return false
      }
      if (isNaN(Number(num)) && num.length > 1) {
        return false
      }
    }
    return true
  }

  formatExceptionMessage (e: Error) {
    return e.name + ': ' + e.message
  }

  formatMatrix (matrix: number[][]) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        matrix[i][j] = this.formatMatrixItem(matrix[i][j])
      }
    }
    return matrix.join('\n')
  }

  formatMatrixItem (value: any, fractionDigits = 3) {
    return CommonUtil.keepNumDecimal(value, fractionDigits)
  }

  showDefaultToast (msg: string, duration = 2000) {
    uni.showToast({
      icon: 'none',
      title: msg,
      duration
    })
  }

  showErrorToast (e: Error, duration = 3000) {
    uni.showToast({
      icon: 'none',
      title: this.formatExceptionMessage(e),
      duration
    })
  }
}
</script>

<style lang="scss">
$op-btn-bg-color: #428bca;
$op-btn-border-color: #357ebd;
.gpa-plus {
  button {
    margin: 10rpx;
  }
  text {
    white-space: pre-wrap;
  }
  &__button-help {
    text-align: center;
    margin-bottom: 8rpx;
  }
  &__matrix-display {
    justify-content: space-between;
    flex-wrap: wrap;
    .matrix {
      padding: 4rpx 8rpx;
      min-height: 200rpx;
      min-width: 200rpx;
      border-width: 1px;
      border-style: dashed;
    }
  }
  &__tmp-row {
    margin: 20rpx 0;
  }
  &__input-number_block {
    width: 500rpx;
    flex-wrap: wrap;
    .insert-area {
      justify-content: space-between;
      .insert-btn {
        width: 220rpx;
      }
    }
  }
  &__number {
    width: 140rpx;
    height: 120rpx;
    line-height: 120rpx;
    &--small-text {
      font-size: 28rpx;
    }
  }
  &__right-area {
    flex: 1;
    flex-wrap: wrap;
  }
  &__right-area-button {
    margin: 4rpx 10rpx !important;
    min-width: 190rpx;
    height: 60rpx;
    font-size: 90%;
    color: #fff;
    background-color: $op-btn-bg-color;
    border-color: $op-btn-border-color;
    border-radius: 0;
  }
  &__bottom-area {
    margin-top: 20rpx;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  &__bottom-area-button {
    width: 30%;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 90%;
    color: #fff;
    background-color: $op-btn-bg-color;
    border-color: $op-btn-border-color;
    border-radius: 0;
  }
}
</style>
