class Ground {
  constructor(context) {
    this.context = context;
    this.groundImage = document.querySelector('#ground');
    this.startTime = Date.now();
  }

  draw() {
    let context = this.context,
      sx = ((Date.now() - this.startTime) % 300) / 300 * 60;
    context.save();
    context.drawImage(this.groundImage, sx, 0, 720, 280, 0, 1000, 720, 280);
    context.restore();
  }
}