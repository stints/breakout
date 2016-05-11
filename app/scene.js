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
  }
}
