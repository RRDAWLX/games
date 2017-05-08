class Component {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    ifCrashWith(component) {
        if ((this.x > component.x + component.width) || (this.x + this.width < component.x) || (this.y > component.y + component.height) || (this.y + this.height < component.y)){
            return false;
        }
        return true;
    }
}

class Obstacle extends Component {
    constructor(context, x, y, width, height, speedX = 1, color = 'green') {
        super(x, y, width, height);
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

class Bird extends Component {
    constructor(context, x, y, width, height) {
        super(x, y, width, height);
        this.context = context;
        this.color = 'red';
        this.a = 10;
    }

    updatePosition() {
        let context = this.context;
        context.save();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}

class Game {
    constructor() {
        this.refresh = this.refresh.bind(this);
        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = 400;
        this.height = this.canvas.height = 247;
        this.context = this.canvas.getContext('2d');
        this.obstMinHeight = this.height * 0.2;
        this.obstHeightDelta = this.height * 0.5;
        this.gapMinHeight = this.height * 0.2;
        this.gapHeightDelta = this.height * 0.1;

        this.obstacles = [];
        this.lastObstTime = Date.now();
        this.bird = new Bird(this.context, 10, (this.height - 10) / 2, 10, 10);
        this.crashed = false;

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

    addTwoObstacles() {
        this.lastObstTime = Date.now();
        let obstTopHeight = this.obstMinHeight + Math.random() * this.obstHeightDelta,
            gapHeight = this.gapMinHeight + Math.random() * this.gapHeightDelta,
            obstBottomY = obstTopHeight + gapHeight,
            obstBottomHeight = this.height - obstBottomY;
        this.obstacles.push(new Obstacle(this.context, this.width, 0, 20, obstTopHeight));
        this.obstacles.push(new Obstacle(this.context, this.width, obstBottomY, 20, obstBottomHeight));
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    getNewFrame() {
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
        if (now - this.lastObstTime > 2000) {
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
        return this.crashed;
    }

    refresh() {
        this.clear();
        this.getNewFrame();
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
        console.log('stop');
    }
}

let game = new Game();
game.start();
/*setTimeout(()=>{
    game.stop();
}, 20000);
*/
