class Bird {
    constructor(context, x, y, width, height, flyV = -6, a = 0.3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fly = this.fly.bind(this);

        this.context = context;
        this.image = document.querySelector('#bird');
        this.yCeil = this.context.canvas.height - this.height / 2;
        this.yFloor = this.height / 2;
        // this.flyHeight = 30;
        this.v = -1;     // 起始上升速度
        this.flyV = flyV;   // 每次点击后上升速度
        this.a = a;
        // this.flyVelocity = -Math.sqrt(2 * this.a * this.flyHeight);
        this.frameCounter = -1;
        this.sy = 0;
    }

    updatePosition() {
        this.frameCounter = (this.frameCounter + 1) % 18;
        this.sy = Math.floor(this.frameCounter / 18 * 3);
        this.v += this.a;
        this.y += this.v;
        if (this.y < this.yFloor) {
            this.y = this.yFloor;
            this.v = 0;
        } else if (this.y > this.yCeil) {
            this.y = this.yCeil;
            this.v = 0;
        }
        let context = this.context;
        context.save();
        context.translate(this.x, this.y);
        // context.fillStyle = 'grey';      // debug
        // context.fillRect(0, -this.height / 2, this.width, this.height);   // debug
        context.drawImage(this.image, 0, this.sy * 60, 88, 60, 0, -this.height / 2, this.width, this.height);
        context.restore();
    }

    fly() {
        this.v = this.flyV;
        console.log(this.v);    // debug
    }

    ifCrashWith(obstacle) {
        if ((this.x > obstacle.x + obstacle.width) || (this.x + this.width < obstacle.x) || (this.y - this.height / 2 > obstacle.y + obstacle.height) || (this.y + this.height / 2 < obstacle.y)){
            return false;
        }
        console.log(this);  // debug
        console.log(obstacle); // debug
        return true;
    }
}
