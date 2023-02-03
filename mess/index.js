const canvas = document.getElementById('canvas')
const width = canvas.width = document.body.clientWidth
const height = canvas.height = document.body.clientHeight - 16
const ctx = canvas.getContext('2d')
const radius = 3 // 圆点半径，单位 px

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

// 随机绘画
function randomDraw() {
  const [x, y] = getRandomPoint()
  drawLine(prePoint[0], prePoint[1], x, y)
  drawCircle(x, y)
  prePoint = [x, y]
}

// 进度条相关功能
const rateDom = document.getElementById('rate')
const percentageDom = document.getElementById('percentage')

function calcDrawingPercentage() {
  const { data } = ctx.getImageData(0, 0, width, height)
  let count = 0

  for (let i = 3; i < data.length; i += 4) {
    if (data[i]) {
      count++
    }
  }

  const percentage = count * 4 / (width * height)
  rateDom.style.cssText = `width: ${percentage}%`
  percentageDom.innerText = percentage.toFixed(4) + ' %'
  return percentage
}

let task = null

canvas.addEventListener('click', function() {
  if (task) {
    clearInterval(task)
    task = null
  } else {
    task = setInterval(() => {
      randomDraw()

      if (calcDrawingPercentage() === 100) {
        clearInterval(task)
        task = null
      }
    }, 100)
  }
})
