class System {
  constructor(canvas, dispatch, manager) {
    this._canvas = canvas;
    this._dispatch = dispatch;
    this._manager = manager;
  }
}

class RenderSystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);
    this._ctx = this._canvas.getContext('2d');
  }

  clearCanvas(x, y, width, height) {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  // RenderSystem assumes that anything with a RenderComponent also has a PositionComponent
  update() {
    var entities = this._manager.getEntitiesByComponent('render');

    this.clearCanvas();

    for(let i = 0; i < entities.length; i++) {
      // RenderComponent
      let width = entities[i].render.width;
      let height = entities[i].render.height;
      let color = entities[i].render.color;

      // PositionComponent
      let x = entities[i].position.x;
      let y = entities[i].position.y;

      this._ctx.fillStyle = color;
      this._ctx.fillRect(x, y, width, height);
    }
  }
}
