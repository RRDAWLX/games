class Ground {
  /**
   * @param {object} context canvas 2d上下文
   * @param {object} image 地面的图片资源
   */
  constructor({context, image}) {
    this.context = context;
    this.image = image;
    this.startTime = Date.now();
  }

  draw() {
    let context = this.context,
      sx = ((Date.now() - this.startTime) % 300) / 300 * 60;
    context.save();
    context.drawImage(this.image, sx, 0, 720, 280, 0, 1000, 720, 280);
    context.restore();
  }
}