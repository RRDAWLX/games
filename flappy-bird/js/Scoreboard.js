class Scoreboard {
  constructor({context, bird, obstacles}) {
    this.context = context;
    this.bird = bird;
    this.obstacles = obstacles;
    this.score = 0;
    this.numberImage = document.querySelector('#number');
    this.numberX = [0, 61, 121, 191, 261, 331, 401, 471, 541, 611]; // 数字 0-9 在图片中横坐标
    this.numberY = 0;   // 数字在图片的纵坐标
    this.numberWidth = 60;    // 单个数字宽度
    this.numberHeight = 91;   // 单个数字高度
  }

  reset() {
    this.score = 0;
  }

  /**
   * @desc 计分
   */
  count() {
    let obstacles = this.obstacles,
      bird = this.bird;
    if (obstacles.length > 0) {
      for (let i = 0, len = obstacles.length; i < len; i += 2) {
        let obst = obstacles[i];
        if (!obst.counted && (bird.x - bird.width / 2) > (obst.x + obst.width)) {   // 当前的障碍物未被计分，且在鸟的后面
          obst.counted = true;
          this.score++;
          console.log(this.score);
        } else if ((bird.x + bird.width / 2) < obst.x) {  // 当前的障碍物在鸟的前面
          break;
        }
      }
    }
    return this;
  }

  draw() {
    let context = this.context,
      image = this.numberImage,
      numsArr = this.score.toString().split(''),  // 将当前得分转换成单个数字的数组
      len = numsArr.length,
      startX = (context.canvas.width - len * this.numberWidth) / 2;   // 开始绘制数字的横坐标
    for (let i = 0; i < len; i++) {
      context.drawImage(image, this.numberX[+numsArr[i]], this.numberY, this.numberWidth, this.numberHeight, startX + i * this.numberWidth, 100, this.numberWidth, this.numberHeight);
    }
  }
}