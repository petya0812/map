export function generateBaloons(count) {
  let i = 1
  const baloons = []
  while (i <= count) {
    const deltaX = (Math.random() - 0.4) * 0.01 * i
    const deltaY = (Math.random() - 0.4) * 0.01 * i
    baloons.push({
      id: i,
      route: [
        [30.06497118892972 * (1 + deltaX), 60.09796067453493 * (1 + deltaY)],
        [30.16497118892972 * (1 + deltaX), 60.12796067453493 * (1 + deltaY)],
        [30.20497118892972 * (1 + deltaX), 60.23796067453493 * (1 + deltaY)],
        [30.36497118892972 * (1 + deltaX), 60.39796067453493 * (1 + deltaY)]
      ]
    })
    i++
  }
  return baloons
}