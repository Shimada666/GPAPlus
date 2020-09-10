import { CommonUtil } from '@/utils'
describe('测试保留小数指定位数函数', () => {
  it('测试多余3位的小数保留3位功能', () => {
    expect(CommonUtil.keepNumDecimal(3.12345)).toBe(3.123)
  })
})
