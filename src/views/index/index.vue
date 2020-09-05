<template>
  <view class="gpa-plus uni-padding-wrap uni-common-mt">
    <view class="gpa-plus__matrix-display uni-flex uni-row">
      <view>矩阵A<view class="matrix"><text>{{ matrixAStr }}</text></view></view>
      <view>矩阵B<view class="matrix"><text>{{ matrixBStr }}</text></view></view>
      <view>结果<view class="matrix"><text>{{ matrixResult }}</text></view></view>
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
        <button @click="clickNumber(',')" class="gpa-plus__number">分隔</button>
        <view class="insert-area uni-flex uni-row">
          <button @click="insertOneRow('A')" class="insert-btn">插入A</button>
          <button @click="insertOneRow('B')" class="insert-btn">插入B</button>
        </view>
      </view>
      <view class="gpa-plus__right-area uni-flex">
        <button @click="backspace" class="gpa-plus__right-area-button">退格</button>
        <button @click="clearTmpRow" class="gpa-plus__right-area-button">清空输入</button>
        <button @click="removeMatrixLatestLine('A')" class="gpa-plus__right-area-button">删除A末行</button>
        <button @click="removeMatrixLatestLine('B')" class="gpa-plus__right-area-button">删除B末行</button>
        <button @click="clearMatrix('A')" class="gpa-plus__right-area-button">清空A</button>
        <button @click="clearMatrix('B')" class="gpa-plus__right-area-button">清空B</button>
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
// @ts-ignore
import * as math from 'mathjs'

@Component
export default class GPAPlus extends Vue {
  tmpRow = ''
  matrixAStr = ''
  matrixBStr = ''
  matrixResult = ''

  onLoad () {

  }

  clickNumber (num: string | number) {
    if (num === ',') {
      if (!this.tmpRow) {
        this.showDefaultToast('您还没有输入内容')
        return
      } else if (this.tmpRow.charAt(this.tmpRow.length - 1) === ',') {
        return
      }
    }
    this.tmpRow += num
  }

  insertOneRow (matrix: 'A' | 'B') {
    if (matrix === 'A') {
      this.matrixAStr += this.tmpRow + '\n'
    } else {
      this.matrixBStr += this.tmpRow + '\n'
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
      if (this.matrixAStr.trim().split('\n').length <= 1) {
        this.clearMatrix(matrix)
      } else {
        this.matrixAStr = this.matrixAStr.trim().split('\n').slice(0, -1).join('\n') + '\n'
      }
    } else {
      if (this.matrixBStr.trim().split('\n').length <= 1) {
        this.clearMatrix(matrix)
      } else {
        this.matrixBStr = this.matrixBStr.trim().split('\n').slice(0, -1).join('\n') + '\n'
      }
    }
  }

  clearMatrix (matrix: 'A' | 'B') {
    if (matrix === 'A') {
      this.matrixAStr = ''
    } else {
      this.matrixBStr = ''
    }
  }

  matrixADet () {
    try {
      this.matrixResult = math.det(this.matrixA)
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixAInv () {
    try {
      this.matrixResult = math.inv(this.matrixA)
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixATrace () {
    try {
      this.matrixResult = math.trace(this.matrixA)
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixTranspose (matrix: 'A' | 'B') {
    try {
      if (matrix === 'A') {
        this.matrixAStr = math.transpose(this.matrixA).join('\n')
      } else {
        this.matrixBStr = math.transpose(this.matrixB).join('\n')
      }
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixMultiply () {
    try {
      this.matrixResult = math.multiply(this.matrixA, this.matrixB).join('\n')
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixAdd () {
    try {
      this.matrixResult = math.add(this.matrixA, this.matrixB).join('\n')
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixCross () {
    try {
      this.matrixResult = math.cross(this.matrixA, this.matrixB)
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixDot () {
    try {
      this.matrixResult = math.dot(math.squeeze(this.matrixA), math.squeeze(this.matrixB))
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  get matrixA () {
    const tmp = this.matrixAStr.trim().split('\n')
    return tmp.map(row => row.split(','))
  }

  get matrixB () {
    const tmp = this.matrixBStr.trim().split('\n')
    return tmp.map(row => row.split(','))
  }

  formatExceptionMessage (e: Error) {
    return e.name + ': ' + e.message
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
  }
  &__right-area {
    flex: 1;
    flex-wrap: wrap;
  }
  &__right-area-button {
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
