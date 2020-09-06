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
import { create, all } from 'mathjs'

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 4,
  predictable: false
}
const math = create(all, config)

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
      } else if (this.tmpRowLatestChar === ',') {
        return
      }
    }
    this.tmpRow += num
  }

  insertOneRow (matrix: 'A' | 'B') {
    if (!this.tmpRow) {
      return
    }
    if (this.tmpRowLatestChar === ',') {
      this.tmpRow = this.tmpRow.substring(0, this.tmpRow.length - 1)
    }
    const tmpRowLength = this.tmpRow.split(',').length
    if (matrix === 'A') {
      if (this.matrixA[0] && this.matrixA[0].length !== 0 && this.matrixA[0].length !== tmpRowLength) {
        this.showDefaultToast('与矩阵A已插入形状不一致')
        return
      }
      this.matrixAStr += this.tmpRow + '\n'
    } else {
      if (this.matrixB[0] && this.matrixB[0].length !== 0 && this.matrixB[0].length !== tmpRowLength) {
        this.showDefaultToast('与矩阵B已插入形状不一致')
        return
      }
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
      // @ts-ignore
      this.matrixResult = math.det!(this.matrixA) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixAInv () {
    try {
      // @ts-ignore
      this.matrixResult = math.inv(this.matrixA).join('\n')
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixATrace () {
    try {
      // @ts-ignore
      this.matrixResult = math.trace(this.matrixA) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixTranspose (matrix: 'A' | 'B') {
    try {
      if (matrix === 'A') {
        // @ts-ignore
        this.matrixResult = math.transpose(this.matrixA).join('\n')
      } else {
        // @ts-ignore
        this.matrixResult = math.transpose(this.matrixB).join('\n')
      }
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixMultiply () {
    try {
      // @ts-ignore
      this.matrixResult = math.multiply(this.matrixA, this.matrixB).join('\n')
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixAdd () {
    try {
      // @ts-ignore
      this.matrixResult = math.add(this.matrixA, this.matrixB).join('\n')
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixCross () {
    try {
      // @ts-ignore
      this.matrixResult = math.cross(this.matrixA, this.matrixB) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  matrixDot () {
    try {
      // @ts-ignore
      this.matrixResult = math.dot(math.squeeze(this.matrixA), math.squeeze(this.matrixB)) + ''
    } catch (e) {
      this.showErrorToast(e)
    }
  }

  get matrixA () {
    if (!this.matrixAStr.trim()) {
      return [[]]
    }
    const tmp = this.matrixAStr.trim().split('\n')
    return tmp.map(row => row.split(',').map(item => math.bignumber!(Number(item))))
  }

  get matrixB () {
    if (!this.matrixBStr.trim()) {
      return [[]]
    }
    const tmp = this.matrixBStr.trim().split('\n')
    return tmp.map(row => row.split(',').map(item => math.bignumber!(Number(item))))
  }

  get tmpRowLatestChar () {
    return this.tmpRow.charAt(this.tmpRow.length - 1)
  }

  formatExceptionMessage (e: Error) {
    return e.name + ': ' + e.message
  }

  // formatMatrix (matrix: number[] | number[][]) {
  //   if (matrix[0] instanceof Array) {
  //     for (let i = 0; i < matrix.length; i++) {
  //       for (let j = 0; j < matrix[0].length; j++) {
  //         matrix[i][j] = this.getPrecisionNumber(matrix[i][j])
  //       }
  //     }
  //     return matrix.join('\n')
  //   } else {
  //     for (let i = 0; i < matrix.length; i++) {
  //       matrix[i] = this.getPrecisionNumber(matrix[i])
  //     }
  //     return matrix.toString()
  //   }
  // }

  getPrecisionNumber (value: any, precision = 4) {
    return math.format!(value, precision)
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
