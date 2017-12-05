class Game {
  constructor({bgImage}) {
    this.refresh = this.refresh.bind(this);
    this.fly = this.fly.bind(this);
    this.start = this.start.bind(this);

    this.canvas = document.createElement('canvas');
    this.width = this.canvas.width = 720; // 画布宽度，单位 px。
    this.height = this.canvas.height = 1280; // 画布高度，单位 px。
    this.context = this.canvas.getContext('2d');
    this.obstMinHeight = 300; // 上方障碍物最小高度，单位 px
    this.obstMaxHeight = 700; // 上方障碍物最大高度，单位px。
    this.gapMinHeight = 280; // 上下两个障碍物间的最小间隔，单位 px.
    this.gapMaxHeight = 380; // 上下两个障碍物间的最大间隔，单位 px。
    this.bgImage = bgImage; //
    this.obstTimeInterval = 4000; // 障碍物生成时间间隔
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }

  start() {
    this.lastObstTime = Date.now() - this.obstTimeInterval; // 上次生成障碍物的时间，每次游戏开始时设置此值为一个障碍物生成时间间隔前。
    this.obstacles = [];
    this.bird = new Bird({context: this.context});
    this.crashed = false; // 当前是否发生碰撞的标识字段
    this.ignoreRestart();
    this.listenFly();
    this.refresh();
  }

  crash() {
    this.ignoreFly();
    new Promise(resolve => {
      let anim = () => {
        this.clear();
        this.drawBackground();
        this.obstacles.forEach(obst => {
          obst.draw();
        });
        this.bird.updatePosition().draw();
        if (this.bird.ifCrashIntoGround()) {
          resolve();
        } else {
          window.requestAnimationFrame(anim);
        }
      };
      this.bird.crashConfig();
      anim();
    }).then(() => {
      this.listenRestart();
    });
  }

  /**
   * @desc 刷新游戏画面，并检查是否发生碰撞。
   */
  refresh() {
    this.clear();
    this.frame();
    if (this.checkCrash()) {
      this.crash();
    } else {
      window.requestAnimationFrame(this.refresh);
    }
  }

  /**
   * @desc 清空画布
   */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * @desc 绘制画面
   */
  frame() {
    this.drawBackground();

    // 清除已经移出左边界的障碍物
    if (this.obstacles.length !== 0) {
      let idx = this.obstacles.findIndex(obst => {
        return !obst.isOutOfView();
      });
      this.obstacles.splice(0, idx);
    }

    // 新增障碍物
    let now = Date.now();
    if (now - this.lastObstTime > this.obstTimeInterval) {
      this.addTwoObstacles();
    }

    // 更新留存障碍物的位置
    this.obstacles.forEach(obst => {
      obst.updatePosition().draw();
    });

    // 更新鸟的位置
    this.bird.flap().updatePosition().draw();
  }

  /**
   * @desc 绘制游戏背景
   */
  drawBackground() {
    let context = this.context;
    context.save();
    context.drawImage(this.bgImage, 0, 0, this.width, this.height);
    context.restore();
  }

  /**
   * @desc 检测是否发生了鸟和障碍物的碰撞，或者坠落到了地面。
   */
  checkCrash() {
    let bird = this.bird,
      obstacles = this.obstacles;
    for (let i = 0, len = obstacles.length; i < len; i++) {
      if (bird.ifCrashInto(obstacles[i])) {
        this.crashed = true;
        break;
      } else if (bird.x + bird.width < obstacles[i].x) {
        break;
      }
    }

    if (this.bird.ifCrashIntoGround()) {
      this.crashed = true;
      console.log('crash into the ground');
    }

    return this.crashed;
  }

  /**
   * @desc 生成一对向下两个障碍物
   */
  addTwoObstacles() {
    this.lastObstTime = Date.now();
    let topObstHeight = this.obstMinHeight + Math.random() * (this.obstMaxHeight - this.obstMinHeight), // 上方障碍物高度
      gapHeight = this.gapMinHeight + Math.random() * (this.gapMaxHeight - this.gapMinHeight), // 障碍物间隔高度
      bottomObstY = topObstHeight + gapHeight, // 下方障碍物在画布中的 y 坐标
      bottomObstHeight = this.height - bottomObstY; // 下方障碍物高度
    // 生成上下两个障碍物，并放入障碍物数组统一管理。
    this.obstacles.push(new Obstacle({
      context: this.context,
      type: 'up',
      x: this.width,
      y: 0,
      width: 140,
      height: topObstHeight
    }));
    this.obstacles.push(new Obstacle({
      context: this.context,
      type: 'down',
      x: this.width,
      y: bottomObstY,
      width: 140,
      height: bottomObstHeight
    }));
  }

  /**
   * @desc 使鸟高飞
   */
  fly() {
    this.bird.fly();
  }

  /**
   * @desc 添加使鸟飞行的点击事件监听
   */
  listenFly() {
    this.canvas.addEventListener('click', this.fly, false);
  }

  /**
   * @desc 移除使鸟飞行的点击事件监听
   */
  ignoreFly() {
    this.canvas.removeEventListener('click', this.fly, false);
  }

  /**
   * @desc 添加重新开始游戏的点击事件监听
   */
  listenRestart() {
    this.canvas.addEventListener('click', this.start, false);
  }

  /**
   * @desc 移除重新开始游戏的点击事件监听
   */
  ignoreRestart() {
    this.canvas.removeEventListener('click', this.start, false);
  }
}
