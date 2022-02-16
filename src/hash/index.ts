export const hashStr = (str: string) => {
  let hash = 0,
    i,
    chr
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

export const hashArray = (arr: number[]) => {
  let hash = 0,
    i
  for (i = 0; i < arr.length; i++) {
    hash = (hash << 5) - hash + arr[i]
    hash |= 0
  }
  return hash
}

export const hashNumber = (arr: number[]) => {
  let hash = 0,
    i
  for (i = 0; i < arr.length; i++) {
    hash = (hash << 5) - hash + arr[i]
    hash |= 0
  }
  return hash
}
