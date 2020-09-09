const keepNumDecimal = (num: any, fractionDigits = 3) => {
  const tmp = Math.pow(10, fractionDigits)
  return Math.round(parseFloat(num) * tmp) / tmp
}

export {
  keepNumDecimal
}
