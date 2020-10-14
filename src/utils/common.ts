const keepNumDecimal = (num: any, fractionDigits = 3) => {
  const tmp = Math.pow(10, fractionDigits)
  return Math.round(parseFloat(num) * tmp) / tmp
}

const formatExceptionMessage = (e: Error) => {
  return e.name + ': ' + e.message
}

const showDefaultToast = (msg: string, duration = 2000) => {
  uni.showToast({
    icon: 'none',
    title: msg,
    duration
  })
}

const showErrorToast = (e: Error, duration = 3000) => {
  uni.showToast({
    icon: 'none',
    title: formatExceptionMessage(e),
    duration
  })
}

export {
  keepNumDecimal,
  showDefaultToast,
  showErrorToast
}
