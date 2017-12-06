class Obstacle {
  /**
   * @param {object} context canvas 2d上下文
   * @param {object} image 障碍物的图片资源
   * @param {string} type 障碍物类型，{'up': 上面的障碍物, 'down': 下面的障碍物}，默认值为 ‘up’。
   * @param {number} x 障碍物左上角横坐标
   * @param {number} y 障碍物左上角纵坐标
   * @param {number} width 障碍物宽度，单位 px。
   * @param {number} height 障碍物高度，单位 px。
   * @param {number} speedX 障碍物在 x 轴负方向上的速度，单位 px/s, 默认 100px/s。
   * @param {number} canvasWidth 画布宽度，单位 px，默认值 720 px。
   */
  constructor({context, image, type = 'up', x, y, width, height, speedX = 100, canvasWidth = 720}) {
    this.context = context;
    this.image = image;
    this.type = type;
    this.x = this.startX = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = speedX;
    this.startTime = 0;
  }

  /**
   * @desc 更新障碍物的位置，并在画布上重绘。
   */
  updatePosition() {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    this.x = this.startX - this.speedX * (Date.now() - this.startTime) / 1000;
    return this;
  }

  draw() {
    let context = this.context;
    context.save();
    if (this.type === 'up') {
      context.drawImage(this.image, 157, 819 - this.height, 133, this.height, this.x, this.y, this.width, this.height);
    } else {
      context.drawImage(this.image, 9, 0, 133, this.height, this.x, this.y, this.width, this.height);
    }
    context.restore();
  }

  /**
   * @desc 判断障碍物是否已经完全离开视野。如果画布已经完全移到画布Y轴左侧，则认为已完全离开视野。
   * @return {boolean} {true: 已完全离开视野，false: 还未完全离开视野}。
   */
  isOutOfView() {
    return this.x < -this.width;
  }
}
