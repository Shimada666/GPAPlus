const getUnionList = (list1: any[], list2: any[]) => {
  return [...new Set([...list1, ...list2])]
}

const getIntersectList = (list1: any[], list2: any[]) => {
  const set1 = new Set(list1)
  const set2 = new Set(list2)
  return [...new Set([...set1].filter(x => set2.has(x)))]
}

const getExceptList = (list1: any[], list2: any[]) => {
  const set1 = new Set(list1)
  const set2 = new Set(list2)
  return [...new Set([...set1].filter(x => !set2.has(x)))]
}

export {
  getExceptList,
  getIntersectList,
  getUnionList
}
