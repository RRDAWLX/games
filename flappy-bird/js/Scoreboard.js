class Scoreboard {
  constructor({context, bird, obstacles}) {
    this.context = context;
    this.bird = bird;
    this.obstacles = obstacles;
    this.score = 0;
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
        if (!obst.counted && (bird.x - bird.width / 2) > (obst.x + obst.width)) {
          obst.counted = true;
          this.score++;
          console.log(this.score);
        } else if ((bird.x + bird.width / 2) < obst.x) {
          break;
        }
      }
    }
    return this;
  }

  draw() {

  }
}