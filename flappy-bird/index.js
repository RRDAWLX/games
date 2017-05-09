class Obstacle {
    constructor(context, x, y, width, height, speedX = 1, color = 'green') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.speedX = speedX;
        this.color = color;
    }

    updatePosition() {
        this.x = this.x - this.speedX;
        let context = this.context;
        context.save();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}

class Bird {
    constructor(context, x, y, width, height, flyV = -10, a = 0.3) {
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
        this.v = 0;
        this.flyV = flyV;
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
        this.v = -7;
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

class Game {
    constructor({bgImage}) {
        this.refresh = this.refresh.bind(this);
        this.fly = this.fly.bind(this);

        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = 400;
        this.height = this.canvas.height = 650;
        this.context = this.canvas.getContext('2d');
        this.obstMinHeight = this.height * 0.2;
        this.obstHeightDelta = this.height * 0.5;
        this.gapMinHeight = this.height * 0.2;
        this.gapHeightDelta = this.height * 0.1;

        this.bgImage = bgImage;
        this.obstacles = [];
        this.obstTimeInterval = 4000;
        this.lastObstTime = Date.now() - this.obstTimeInterval;
        this.bird = new Bird(this.context, 10, (this.height - 10) / 2, 44, 30);
        this.crashed = false;

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.listenFly();
    }

    addTwoObstacles() {
        this.lastObstTime = Date.now();
        let obstTopHeight = this.obstMinHeight + Math.random() * this.obstHeightDelta,
            gapHeight = this.gapMinHeight + Math.random() * this.gapHeightDelta,
            obstBottomY = obstTopHeight + gapHeight,
            obstBottomHeight = this.height - obstBottomY;
        this.obstacles.push(new Obstacle(this.context, this.width, 0, 50, obstTopHeight));
        this.obstacles.push(new Obstacle(this.context, this.width, obstBottomY, 50, obstBottomHeight));
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    fillBackground() {
        let context = this.context;
        context.save();
        context.drawImage(this.bgImage, 0, 0, this.width, this.height);
        context.restore();
    }

    frame() {
        this.fillBackground();

        // 清除已经移出左边界的障碍物
        while (true) {
            if (this.obstacles.length === 0) {
                break;
            }
            let obst = this.obstacles[0];
            if (obst.x < -obst.width) {
                this.obstacles.shift();
            } else {
                break;
            }
        }

        // 新增障碍物
        let now = Date.now();
        if (now - this.lastObstTime > this.obstTimeInterval) {
            this.addTwoObstacles();
            // console.log(this.obstacles.length);  // debug
        }

        // 更新留存障碍物的位置
        this.obstacles.forEach(obst => {
            obst.updatePosition();
        });

        // 更新鸟的位置
        this.bird.updatePosition();
    }

    checkCrash() {
        let bird = this.bird,
            obstacles = this.obstacles;
        for (let i = 0, len = obstacles.length; i < len; i++) {
            if (bird.ifCrashWith(obstacles[i])) {
                this.crashed = true;
                break;
            } else if (bird.x + bird.width < obstacles[i].x){
                break;
            }
        }

        if (this.bird.y + this.bird.height / 2 >= this.height) {
            this.crashed = true;
        }

        return this.crashed;
    }

    refresh() {
        this.clear();
        this.frame();
        if (this.checkCrash()) {
            this.stop();
        } else {
            this.nextFrame = window.requestAnimationFrame(this.refresh);
        }
    }

    start() {
        this.refresh();
        console.log('start');
    }

    stop() {
        window.cancelAnimationFrame(this.nextFrame);
        this.ignoreFly();
        console.log('stop');
    }

    fly() {
        this.bird.fly();
    }

    listenFly() {
        this.canvas.addEventListener('click', this.fly, false);
    }

    ignoreFly() {
        this.canvas.removeEventListener('click', this.fly, false);
    }
}

let game = new Game({
    bgImage: document.querySelector('#bg')
});
game.start();
/*setTimeout(()=>{
    game.stop();
}, 20000);
*/
