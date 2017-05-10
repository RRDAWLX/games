class Game {
    constructor({bgImage}) {
        this.refresh = this.refresh.bind(this);
        this.fly = this.fly.bind(this);
        this.start = this.start.bind(this);

        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');
        this.obstMinHeight = this.height * 0.2;
        this.obstHeightDelta = this.height * 0.5;
        this.gapMinHeight = this.height * 0.2;
        this.gapHeightDelta = this.height * 0.1;
        this.bgImage = bgImage;
        this.obstTimeInterval = 4000;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

    addTwoObstacles() {
        this.lastObstTime = Date.now();
        let obstTopHeight = this.obstMinHeight + Math.random() * this.obstHeightDelta,
            gapHeight = this.gapMinHeight + Math.random() * this.gapHeightDelta,
            obstBottomY = obstTopHeight + gapHeight,
            obstBottomHeight = this.height - obstBottomY;
        this.obstacles.push(new Obstacle(this.context, 'up', this.width, 0, 90, obstTopHeight, 1.3));
        this.obstacles.push(new Obstacle(this.context, 'down', this.width, obstBottomY, 90, obstBottomHeight, 1.3));
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
        }
    }

    start() {
        this.lastObstTime = Date.now() - this.obstTimeInterval;
        this.obstacles = [];
        this.bird = new Bird(this.context);
        this.crashed = false;
        this.ignoreRestart();
        this.listenFly();
        this.nextFrame = window.setInterval(this.refresh, 20);
        console.log('start');
    }

    stop() {
        window.clearInterval(this.nextFrame);
        this.ignoreFly();
        this.listenRestart();
        console.log('stop');
    }

    fly() {
        this.bird.fly();
    }

    drop() {

    }

    listenFly() {
        this.canvas.addEventListener('click', this.fly, false);
    }

    ignoreFly() {
        this.canvas.removeEventListener('click', this.fly, false);
    }

    listenRestart() {
        this.canvas.addEventListener('click', this.start, false);
    }

    ignoreRestart() {
        this.canvas.removeEventListener('click', this.start, false);
    }
}
