const canvas = document.getElementById('canvas')
const width = canvas.width = document.body.clientWidth
const height = canvas.height = document.body.clientHeight
const ctx = canvas.getContext('2d')
const radius = 5 // 圆点半径，单位 px

// 在水平区间 [radius, width - radius] 和垂直区间 [radius, height - radius] 内随机取一个点
function getRandomPoint() {
  const x = Math.floor(Math.random() * (width - 2 * radius) + radius)
  const y = Math.floor(Math.random() * (height - 2 * radius) + radius)
  return [x, y]
}

function drawCircle(x, y) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()
}

// 从当前位置向点 (x, y) 画一条直线
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

let prePoint = [Math.floor(width / 2), Math.floor(height / 2)]
drawCircle(...prePoint)

canvas.addEventListener('click', function() {
  const [x, y] = getRandomPoint()
  drawLine(prePoint[0], prePoint[1], x, y)
  drawCircle(x, y)
  prePoint = [x, y]
})
