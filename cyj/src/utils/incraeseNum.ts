type UpdateNumberCallback = (num: number) => void
function increseNum(updateFn: UpdateNumberCallback, finalNum: number, time: number = 1000) {
  const rate = 31
  let num = 1
  // 步长
  const step = finalNum / (time / rate)
  const timer = setInterval(() => {
    num = Math.round(num + step)
    if (num > finalNum) {
      // 有可能加过头
      num = finalNum
      clearInterval(timer)
    }
    updateFn(num)
  }, rate)
}

export default increseNum
