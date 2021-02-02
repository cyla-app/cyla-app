const mean = (array: number[]): number =>
  array.reduce((p, c) => p + c, 0) / array.length

export const stats = (array: number[]) => {
  let avg = mean(array)
  const variance =
    array.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b) /
    array.length
  return { mean: avg, variance }
}

export const max = (array: number[]) =>
  array.reduce(function (a, b) {
    return Math.max(a, b)
  })
