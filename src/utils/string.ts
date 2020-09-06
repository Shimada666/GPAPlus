const getStrCount = (source: string, target: string) => { // source 源字符串 target 特殊字符
  let count = 0
  while (source.indexOf(target) >= 1) {
    source = source.replace(target, '')
    count++
  }
  return count
}

const trim = (str: string, char?: string) => {
  if (char) {
    return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')
  }
  return str.replace(/^\s+|\s+$/g, '')
}

export {
  getStrCount,
  trim
}
