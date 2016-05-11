class Scene {
  constructor(canvas, manager, dispatch) {
    this.canvas = canvas;
    this.manager = manager;
    this.dispatch = dispatch;

    this.ctx = this.canvas.getContext('2d');
  }
}

class Score extends Scene {
  constructor(canvas, manager, dispatch) {
    super(canvas, manager, dispatch);

    this.dispatch.on('scoreUpdate', (entity, args) => this.scoreUpdate(entity, args));
  }

  scoreUpdate(entity, args) {
    this.draw(entity.health.health);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(health) {
    this.clearCanvas();

    for(let i = 1; i <= health; i++) {
      let x = 1000 - 50 * i;
      let y = 20;
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(x, y, 40, 40)
    }
  }
}

class Overlay extends Scene {
  constructor(canvas, manager, dispatch) {
    super(canvas, manager, dispatch);

    this.dispatch.on('gameover', (entity, args) => this.drawGameOver());
    this.dispatch.on('nextlevel', (entity, args) => this.drawNextLevel());
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStart() {
    this.clearCanvas();

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('BREAKOUT', 400, 270);
    this.ctx.fillText('Press Space to Play', 350, 320);
  }

  drawNextLevel(step = 200) {
    console.log(step)
    let alpha = step / 100;

    step--;

    this.clearCanvas();

    if(step <= 0) {
      window.cancelAnimationFrame(this.pid);
      return;
    }

    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Next Level...', 390, 270);

    this.pid = window.requestAnimationFrame(() => this.drawNextLevel(step));
  }

  drawGameOver() {
    this.clearCanvas();

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('BREAKOUT', 400, 270);
    this.ctx.fillText('GAMEOVER', 400, 320);
  }
}
