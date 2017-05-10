class Obstacle {
    /*
     * @param {String} type: {'up': 上面的障碍物, 'down': 下面的障碍物}
     */
    constructor(context, x, y, width, height, speedX = 1, type = 'up') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.speedX = speedX;
        this.type = type;
        this.image = document.querySelector('#pipe');
    }

    updatePosition() {
        this.x = this.x - this.speedX;
        let context = this.context;
        context.save();
        if (this.type === 'up') {
            context.drawImage(this.image, 157, 819 - this.height, 133, this.height, this.x, this.y, this.width, this.height);
        } else {
            context.drawImage(this.image, 9, 0, 133, this.height, this.x, this.y, this.width, this.height);
        }
        context.restore();
    }
}
