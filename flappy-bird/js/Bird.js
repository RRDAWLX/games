class Bird {
  /**
   * @param {object} context canvas 2d上下文
   * @param {number} width 鸟的宽度
   * @param {number} height 鸟的高度
   * @param {number} v 起始上升速度，单位 px/s。默认值为 0 px/s。
   * @param {number} flyV 每次点击后上升速度，单位 px/s。默认值为 -10px/s。
   * @param {number} a 重力加速度，单位 px/s^2。默认值为 0.3px/s^2。
   */
  constructor({
    context,
    width = 85,
    height = 60,
    v = 0,
    flyV = -10,
    a = 0.3
  }) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.configV = v;
    this.configFlyV = flyV;
    this.configA = a;

    this.image = document.querySelector('#bird');
    this.yFloor = this.height / 2; // bird中心点纵坐标下限
    this.fly = this.fly.bind(this);
  }

  reset() {
    let canvas = this.context.canvas;

    this.x = 1.5 * this.width;  // bird的中心点横坐标
    this.y = canvas.height / 2;  // bird的中心点纵坐标
    this.v = this.configV;
    this.flyV = this.configFlyV;
    this.a = this.configA;
    this.yCeil = canvas.height - 280 - this.height / 2 ; // bird中心点纵坐标上限
    this.sy = 0;  // 在源图片上截取图片起始点的纵坐标
    this.startTime = Date.now();
  }

  /**
   * @desc 振翅
   */
  flap() {
    this.sy = 60 * (Math.floor((Date.now() - this.startTime) / 100) % 3);
    return this;
  }

  /**
   * @desc 更新鸟的位置
   */
  updatePosition() {
    this.v += this.a;
    this.y += this.v;
    if (this.y < this.yFloor) {
      this.y = this.yFloor;
      this.v = 0;
    } else if (this.y > this.yCeil) {
      this.y = this.yCeil;
      this.v = 0;
    }
    return this;
  }

  /**
   * @desc 在画布上绘制鸟
   */
  draw() {
    let context = this.context;
    context.save();
    context.translate(this.x, this.y);
    context.drawImage(this.image, 0, this.sy, 88, 60, -this.width / 2, -this.height / 2, this.width, this.height);
    context.restore();
  }

  fly() {
    this.v = this.flyV;
  }

  /**
   * @desc 启用发生撞击后的配置
   */
  crashConfig() {
    this.yCeil = 1280 + this.height / 2;
    this.sy = 60;
    this.v = this.flyV * 2;
    this.a = this.a * 3;
  }

  /**
   * @desc 判断是否与指定的障碍物发生了撞击
   * @param {object} obstacle 障碍物对象
   * @return {boolean} {true: 发生了撞击，false: 未发生撞击}
   */
  ifCrashInto(obstacle) {
    if (
      (this.x - this.width / 2 > obstacle.x + obstacle.width - 7) ||
      (this.x + this.width / 2 < obstacle.x + 7) ||
      (this.y - this.height / 2 > obstacle.y + obstacle.height) ||
      (this.y + this.height / 2 < obstacle.y)
    ) {
      return false;
    }
    console.log('crash into an obstacle');
    return true;
  }

  /**
   * @desc 判断是否坠落到了地面
   * @return {boolean} {true: 坠落到了地面，false: 未坠落到地面}
   */
  ifCrashIntoGround() {
    return this.y >= this.yCeil;
  }
}
